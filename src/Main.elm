module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (href, class)
import Random exposing (generate)
import Uuid exposing (uuidGenerator)
import Class exposing (Class)
import Url exposing (percentEncode)
import Html.Attributes exposing (tabindex)

type alias Model =
    { result: List Class
    , events: List String
    , readyToDownload: Bool
    }

type Msg
    = GotInput String
    | GotEvent String

main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }

init : flags -> (Model, Cmd msg)
init _ =
    ( { result = [], events = [], readyToDownload = False }, Cmd.none)

view : Model -> Html Msg
view model =
    let
        textareaStyle = "h-16 flex-none p-2 bg-gray-200 text-gray-500 w-full overflow-hidden"
        downloadStyle = "text-green-500 border-b-4 border-green-500"
        invalidStyle = "font-bold text-red-600"
    in
    
    div [ class "w-1/3 mx-auto pt-16 min-h-screen flex flex-col" ]
        [ textarea [ onInput GotInput, class textareaStyle ] []
        -- , Html.p [] [ Html.text (Debug.toString model.result )]
        , div [ class "flex-grow h-full" ] <|
            if model.readyToDownload then
                [ a [ href <| "data:text/calendar," ++ percentEncode (Class.toCalendar model.events)
                    , class downloadStyle
                    , tabindex 0
                    ]
                    [ text "click here to download" ]
                , viewPreview model.result
                ]
            else
            
                [ a [ href "#invalid-input"
                   , class invalidStyle]
                [ text "please check your input" ]
            ]
        , p [ class "text-center" ] [ Html.text "made with love by NDK" ]
        , p [ class "text-center" ] [ Html.text "facebook · github" ]
        ]

viewPreview : List Class -> Html Msg
viewPreview classes =
    let
        filterWday wday =
            String.join ", " << List.filterMap (\class ->
                if class.wday == wday
                    then Just (Class.abbr class.title)
                    else Nothing
            )
    in
    
    div []
        [ h2 [ class "font-bold text-xl mt-4 mb-1" ]
            [ text "Xem trước:" ]
        , p [] [ span [ class "font-semibold"] [ text "Thứ hai: " ]
                    , text (filterWday 2 classes)
                    ]
        , p [] [ span [ class "font-semibold"] [ text "Thứ ba: " ]
                    , text (filterWday 3 classes)
                    ]
        , p [] [ span [ class "font-semibold"] [ text "Thứ tư: " ]
                    , text (filterWday 4 classes)
                    ]
        , p [] [ span [ class "font-semibold"] [ text "Thứ năm: " ]
                    , text (filterWday 5 classes)
                    ]
        , p [] [ span [ class "font-semibold"] [ text "Thứ sáu: " ]
                    , text (filterWday 6 classes)
                    ]
        , p [] [ span [ class "font-semibold"] [ text "Thứ bảy: " ]
                    , text (filterWday 7 classes)
                    ]
        , p [] [ span [ class "font-semibold"] [ text "Chủ nhật: " ]
                    , text (filterWday 8 classes)
                    ]
        ]

update : Msg -> Model ->  ( Model, Cmd Msg )
update msg model =
    case msg of
        GotInput raw ->
             let
                eventGenerator class =
                    Random.map (\uuid -> Class.toEvent (Uuid.toString uuid) class) uuidGenerator
                newResult = String.split "\n" raw |> List.filterMap Class.parse
             in
             ( { model | result = newResult
                       , events = []
                       , readyToDownload = False
               }, Cmd.batch
             (List.map (\class -> generate GotEvent (eventGenerator class)) newResult) )

        GotEvent event ->
            ( { model | events = event :: model.events,
                        readyToDownload = List.length model.result == List.length model.events + 1
              }, Cmd.none )

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none