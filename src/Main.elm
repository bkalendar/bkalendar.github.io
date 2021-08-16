module Main exposing (main)

import Array exposing (Array)
import Browser
import Converter exposing (timetableToEvents)
import Css
import Event exposing (Event)
import Html.Styled as Html exposing (Html, toUnstyled)
import Html.Styled.Attributes exposing (css, download, for, href, id, name, target, value)
import Html.Styled.Events exposing (onClick, onInput)
import Markdown
import Timetable exposing (Timetable)
import Url exposing (percentEncode)


type alias Model =
    { raw : String
    , readyToDownload : Bool
    , events : Array Event
    }


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view >> toUnstyled
        , update = update
        , subscriptions = subscriptions
        }


init : flags -> ( Model, Cmd msg )
init _ =
    ( { raw = ""
      , readyToDownload = False
      , events = Array.empty
      }
    , Cmd.none
    )


view : Model -> Html Msg
view model =
    Html.div [ css [ Css.maxWidth (Css.px 500), Css.margin Css.auto]]
        [ Html.h1 [] [ Html.text "BKalendar" ]
        , Html.label [ for "timetable-input" ]
            [ Html.text "Copy thời khóa biểu vào đây" ]
        , Html.textarea
            [ css [ Css.display Css.block ]
            , id "timetable-input"
            , name "timetable-input"
            , onInput GotInput
            , value model.raw
            ]
            []
        , if not model.readyToDownload then
            Html.text ""

          else
            viewDownload model.events
        , viewGuide
        ]


viewGuide : Html Msg
viewGuide =
    Html.div []
        [ Html.fromUnstyled <| Markdown.toHtml [] """
## Tạo lịch mới trên Google Calendar

1. Mở Google Calendar trên máy tính.
2. Ở thanh bên trái, kéo xuống, cạnh phần **Lịch khác**, hãy nhấp vào biểu tượng **Thêm lịch khác +** rồi **Tạo lịch mới**.
3. Thêm tên lịch, **HK211** chẳng hạn.
4. Nhấp vào **Tạo lịch**.

## Nhập file .ics vào lịch mới tạo

Sau khi tạo lịch:

1. Ở bên trái, hãy nhấp vào **Nhập và xuất**.
2. Nhấp vào **Chọn tệp từ máy tính** rồi chọn file vừa tải về.
3. Chọn lịch mà bạn vừa tạo ở bước trên.
4. Nhấp vào **Nhập**.

Vậy là xong rồi á!

___

## Bonus: Bật thông báo cho lịch.

1. Ở bên trái, hãy nhấp vào lịch mà bạn vừa tạo.
2. Kéo xuống và tìm chỗ **Thông báo sự kiện**, nhập vào **Thêm thông báo**
3. Chỉnh thời gian lại như ý muốn là được!

Sau khi làm xong, trước mỗi giờ học, app Google Calendar trên điện thoại của bạn sẽ thông báo.

## Bonus 2: Thêm link Google Meet

Nếu bạn sử dụng mail trường thì sẽ có thêm một tính năng thêm link Google Meet. Thêm như sau:

1. Nhấp vào từng sự kiện rồi nhấp vào cây bút **Chỉnh sửa sự kiện**.
2. Nhấp vào cái nút màu xanh **Thêm hội nghị truyền hình trên Google Meet**.
3. Nhấp vào mũi tên chỉ xuống kế bên bánh răng.
4. Rê chuột vào kế bên link Meet, nhấp vào cây bút để chỉnh sửa link thành link meet của thầy cô các bạn.

Còn không, các bạn thêm link Meet vào ô địa điểm hay mô tả cũng được.

___

Made with love by NDK ❤️
""" ]



-- Html.div []
--     [ Html.h2 [] [ Html.text "Tạo lịch mới trên Google Calendar" ]
--     , Html.p []
--         [ Html.text "Đọc hướng dẫn tại đây: "
--         , Html.a [ href "https://support.google.com/calendar/answer/37095" ] [ Html.text "Tạo lịch mới" ]
--         ]
--     , Html.p [] [ Html.text "Bạn hãy tạo một cái lịch tên là HK211, chẳng hạn." ]
--     , Html.h2 [] [ Html.text "Nhập file .ics vào lịch mới tạo" ]
--     , Html.p []
--         [ Html.text "Đọc hướng dẫn tại đây (bước 2): "
--         , Html.a [ href "https://support.google.com/calendar/answer/37118" ] [ Html.text "Nhập các sự kiện vào Lịch Google" ]
--         ]
--     , Html.p [] [ Html.text "Bạn hãy nhập file vừa tải về vào lịch mới tạo nhé." ]
--     , Html.h2 [] [ Html.text "Bonus: Bật thông báo cho lịch" ]
--     , Html.p [] [ Html.text ""]
--     ]


viewDownload : Array Event -> Html Msg
viewDownload events =
    let
        downloadLink =
            "data:text/calendar," ++ percentEncode (Array.toList events |> Event.toCalendar)
    in
    Html.div []
        [ Html.p [] [ Html.a [ target "_blank", href downloadLink, download "export" ] [ Html.text "Tải về" ] ]
        , Html.p [] [ Html.text "Nếu bạn chưa rõ tải về rồi làm gì, đọc tiếp hướng dẫn bên dưới." ]
        ]


type Msg
    = GotInput String
    | GotEvent Int Event


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotInput raw ->
            let
                parseResult =
                    Timetable.parse raw
            in
            ( { model | raw = raw, readyToDownload = False, events = Array.empty }
            , case parseResult of
                Nothing ->
                    Cmd.none

                Just timetable ->
                    timetableToEvents (GotEvent (List.length timetable.entries)) timetable
            )

        GotEvent total event ->
            ( { model
                | events = Array.push event model.events
                , readyToDownload = Array.length model.events + 1 == total
              }
            , Cmd.none
            )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
