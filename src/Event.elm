module Event exposing (Event, toCalendar)

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
        ++ "\u{000D}\nUID:"
        ++ Uuid.toString event.uuid
        ++ "\u{000D}\nDTSTAMP:20210815T200000"
        ++ "\u{000D}\nSUMMARY:"
        ++ event.subject
        ++ "\u{000D}\nDESCRIPTION:"
        ++ event.description
        ++ "\u{000D}\nLOCATION:"
        ++ event.location
        ++ "\u{000D}\nDTSTART:"
        ++ toDate event.start
        ++ "\u{000D}\nDTEND:"
        ++ toDate event.end
        ++ "\u{000D}\nRDATE:"
        ++ String.join "," (List.map toDate event.repeats)
        ++ "\u{000D}\nEND:VEVENT"


toCalendar : List Event -> String
toCalendar events =
    "BEGIN:VCALENDAR\u{000D}\nVERSION:2.0\u{000D}\nPRODID:-//bkalendar//Google Calendar v1.0/VI\u{000D}\n"
        ++ String.join "\u{000D}\n" (List.map toVEvent events)
        ++ "\u{000D}\nEND:VCALENDAR"


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
