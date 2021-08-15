module Event exposing (Event, toCalendar)

import Array exposing (Array)
import Iso8601
import Time exposing (Month(..), Posix)
import Uuid exposing (Uuid)


type alias Event =
    { uuid : Uuid
    , subject : String
    , description : String
    , location : String
    , start : Posix
    , end : Posix
    , repeats : List Posix
    }


toVEvent : Event -> String
toVEvent event =
    "BEGIN:VEVENT"
        ++ "\nUID:"
        ++ Uuid.toString event.uuid
        ++ "\nDTSTAMP:20210815T200000"
        ++ "\nSUMMARY:"
        ++ event.subject
        ++ "\nDESCRIPTION:"
        ++ event.description
        ++ "\nLOCATION:"
        ++ event.location
        ++ "\nDTSTART:"
        ++ toDate event.start
        ++ "\nDTEND:"
        ++ toDate event.end
        ++ "\nRDATE:"
        ++ String.join "," (List.map toDate event.repeats)
        ++ "\nEND:VEVENT"


toCalendar : List Event -> String
toCalendar events =
    """BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//bkalendar//Google Calendar v1.0/VI
""" ++ String.join "\n" (List.map toVEvent events) ++ """
END:VCALENDAR"""


toDate : Posix -> String
toDate posix =
    let
        dttm =
            String.padLeft 2 '0' << String.fromInt

        timestamp time =
            (List.map (List.map (\f -> dttm <| f time) >> String.join "")
                [ [ Time.toYear Time.utc
                  , Time.toMonth Time.utc >> monthToInt
                  , Time.toDay Time.utc
                  ]
                , [ Time.toHour Time.utc
                  , Time.toMinute Time.utc
                  , Time.toSecond Time.utc
                  ]
                ]
                |> String.join "T"
            )
                ++ "Z"
    in
    timestamp posix


monthToInt : Month -> Int
monthToInt month =
    case month of
        Jan ->
            1

        Feb ->
            2

        Mar ->
            3

        Apr ->
            4

        May ->
            5

        Jun ->
            6

        Jul ->
            7

        Aug ->
            8

        Sep ->
            9

        Oct ->
            10

        Nov ->
            11

        Dec ->
            12
