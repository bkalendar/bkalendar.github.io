module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (href, class)
import Random exposing (generate)
import Uuid exposing (Uuid, uuidGenerator)
import Class exposing (Class)
import Url exposing (percentEncode)

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
    div []
        [ textarea [ onInput GotInput ] []
        , Html.p [] [ Html.text (Debug.toString model.result )]
        , Html.a [ href <| "data:text/calendar," ++ percentEncode (Class.toCalendar model.events) ]
            [ Html.text "click here?" ]
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
            ( { model | events = event :: model.events }, Cmd.none )

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none