module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (href, class)
import Random exposing (generate)
import Uuid exposing (Uuid, uuidGenerator)
import Class exposing (Class)
import Url exposing (percentEncode)
import Html.Attributes exposing (download)
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
        textareaStyle = "p-2 bg-gray-200 text-gray-500 w-full h-48 overflow-hidden"
        downloadStyle = "text-green-500 border-b-4 border-green-500"
        invalidStyle = "font-bold text-red-600"
    in
    
    div [ class "w-1/3 mx-auto mt-16" ]
        [ textarea [ onInput GotInput, class textareaStyle ] []
        -- , Html.p [] [ Html.text (Debug.toString model.result )]
        , if model.readyToDownload then
            Html.a [ href <| "data:text/calendar," ++ percentEncode (Class.toCalendar model.events)
                   , class downloadStyle
                   , tabindex 0
                   ]
                [ Html.text "click here to download" ]
          else
            Html.a [ href "#invalid-input"
                   , class invalidStyle]
                [ Html.text "please check your input" ]
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