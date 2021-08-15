module Timetable exposing (Timetable, TimetableEntry, abbr, example, parse, toCalendar, toEvent)

import Parser exposing (..)
import Time exposing (..)


type alias Timetable =
    { semester : Int

    -- Year from
    , from : Int

    -- Year to
    , to : Int
    , entries : List TimetableEntry
    }



-- Timetable Entry


type alias TimetableEntry =
    { id : String
    , name : String
    , group : String
    , wday : Int
    , start : Int
    , end : Int
    , room : String
    , weeks : List Int
    }


example : String
example =
    "CO1027\tKỹ thuật lập trình\t3\t--\tL04\t4\t11-12\t16:00 - 17:50\tH1-304\tBK-CS2\t--|09|10|11|12|13|14|15|--|17|18|"


abbrHelp : List Char -> Bool -> String -> String
abbrHelp revChars snatch text =
    case String.uncons text of
        Nothing ->
            String.fromList (List.reverse revChars)

        Just ( '(', rest ) ->
            abbrHelp ('(' :: revChars) True rest

        Just ( ')', _ ) ->
            String.fromList (List.reverse (')' :: revChars))

        Just ( '-', _ ) ->
            String.fromList (List.reverse revChars)

        Just ( ' ', rest ) ->
            abbrHelp revChars True rest

        Just ( char, rest ) ->
            if snatch then
                abbrHelp (Char.toUpper char :: revChars) False rest

            else
                abbrHelp revChars False rest


abbr : String -> String
abbr name =
    let
        result =
            abbrHelp [] True name
    in
    if String.length result == 1 then
        List.head (String.split " " name) |> Maybe.withDefault name

    else
        result


parse : String -> Maybe Timetable
parse =
    Parser.run
        (Parser.succeed Timetable
            |. Parser.chompUntil "\nHọc kỳ "
            |. Parser.token "\nHọc kỳ "
            |= Parser.int
            |. Parser.token " Năm học "
            |= Parser.int
            |. Parser.token " - "
            |= Parser.int
            |. Parser.spaces
            |. Parser.chompUntil "\n"
            |. Parser.spaces
            |. Parser.chompUntil "\n"
            |. Parser.spaces
            |= Parser.loop []
                (\entries ->
                    Parser.oneOf
                        [ Parser.succeed (Loop entries)
                            |. Parser.symbol "\n"
                        , parser |> Parser.map (\entry -> Loop (entry :: entries))
                        , Parser.succeed (Done entries)
                        ]
                )
        )
        >> Result.toMaybe


parser : Parser TimetableEntry
parser =
    let
        cellChomper =
            chompWhile (\c -> c /= '\t')
    in
    succeed TimetableEntry
        |= getChompedString cellChomper
        |. symbol "\t"
        |= getChompedString cellChomper
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |= getChompedString cellChomper
        |. symbol "\t"
        |= int
        |. symbol "\t"
        |= int
        |. symbol "-"
        |= int
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |= getChompedString cellChomper
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |= weekParser


weekParser : Parser (List Int)
weekParser =
    loop ( 0, [] )
        (\( index, result ) ->
            oneOf
                [ Parser.succeed (Loop ( index + 1, result ))
                    |. symbol "--|"
                , Parser.succeed (Loop ( index + 1, index :: result ))
                    |. symbol "0"
                    |. int
                    |. symbol "|"
                , Parser.succeed (Loop ( index + 1, index :: result ))
                    |. int
                    |. symbol "|"
                , Parser.succeed (Done result)
                ]
        )


toCalendar : List String -> String
toCalendar events =
    """BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//bkalendar//Google Calendar v1.0/VI
""" ++ String.join "\n" events ++ """
END:VCALENDAR"""


toEvent : String -> TimetableEntry -> String
toEvent uuid class =
    case class.weeks of
        [] ->
            ""

        headWeek :: tailWeeks ->
            let
                firstWeek =
                    List.foldl min headWeek tailWeeks
            in
            "BEGIN:VEVENT"
                ++ "\nUID:"
                ++ uuid
                ++ "\nDTSTAMP:20210516T200000"
                ++ "\nSUMMARY:"
                ++ class.name
                ++ "\nDESCRIPTION:"
                ++ class.group
                ++ "\nLOCATION:"
                ++ class.room
                ++ "\nDTSTART:"
                ++ toDate class.wday class.start firstWeek
                ++ "\nDTEND:"
                ++ toDate class.wday (class.end + 1) firstWeek
                ++ "\nRDATE:"
                ++ String.join "," (List.map (toDate class.wday class.start) class.weeks)
                ++ "\nEND:VEVENT"


origin : Int
origin =
    1613944800000



-- "yyyyMMddThhmmssZ"
-- Monday of week 0 is 5h 22/02/2021, 1613944800000 in posix


toDate : Int -> Int -> Int -> String
toDate wday start week =
    let
        date =
            origin + week * 604800000 + (wday - 2) * 86400000

        startTime =
            millisToPosix <| date + start * 3600000

        dttm =
            String.padLeft 2 '0' << String.fromInt

        timestamp time =
            (List.map (List.map (\f -> dttm <| f time) >> String.join "")
                [ [ toYear utc
                  , toMonth utc >> monthToInt
                  , toDay utc
                  ]
                , [ toHour utc
                  , toMinute utc
                  , toSecond utc
                  ]
                ]
                |> String.join "T"
            )
                ++ "Z"
    in
    timestamp startTime


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
