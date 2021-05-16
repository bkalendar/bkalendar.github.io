module Class exposing (Class, parse, example, toEvent, toCalendar)

import Parser exposing (..)
import Time exposing (..)

type alias Class =
    { title : String
    , desp : String
    , room : String
    , wday : Int
    , start : Int
    , end : Int
    , weeks : List Int
    }

example = "CO1027	Kỹ thuật lập trình	3	--	L04	4	11-12	16:00 - 17:50	H1-304	BK-CS2	--|09|10|11|12|13|14|15|--|17|18|"

parse : String -> Maybe Class
parse raw = run parser raw |> Result.toMaybe

parser : Parser Class
parser =
    let
        cellChomper = chompWhile (\c -> c /= '\t')

        toClass id display group wday start end room weeks =
            let
                title = display ++ " - " ++ id
                desp = group
                -- room = room
            in
            Class title desp room wday start end weeks
    in
    succeed toClass
        |= (getChompedString cellChomper)
        |. symbol "\t"
        |= (getChompedString cellChomper)
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |= (getChompedString cellChomper)
        |. symbol "\t"
        |= int
        |. symbol "\t"
        |= int
        |. symbol "-"
        |= int
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |= (getChompedString cellChomper)
        |. symbol "\t"
        |. cellChomper
        |. symbol "\t"
        |= weekParser
        
weekParser : Parser (List Int)
weekParser =
    loop (0, []) (\(index, result) ->
        oneOf
            [ Parser.succeed (Loop (index + 1, result))
                |. symbol "--|"
            , Parser.succeed (Loop (index + 1, index::result))
                |. symbol "0"
                |. int
                |. symbol "|"
            , Parser.succeed (Loop (index + 1, index::result))
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

toEvent : String -> Class -> String
toEvent uuid class =
    case class.weeks of
        [] -> ""
        headWeek :: tailWeeks ->
            let
                firstWeek = List.foldl min headWeek tailWeeks
            in
            "BEGIN:VEVENT" ++
            "\nUID:" ++ uuid ++
            "\nDTSTAMP:20210516T200000" ++
            "\nSUMMARY:" ++ class.title ++
            "\nDESCRIPTION:" ++ class.desp ++
            "\nLOCATION:" ++ class.room ++
            "\nDTSTART:" ++ toDate class.wday class.start firstWeek ++
            "\nDTEND:" ++ toDate class.wday (class.end + 1) firstWeek ++
            "\nRDATE:" ++ String.join "," (List.map (toDate class.wday class.start) class.weeks) ++
            "\nEND:VEVENT"

origin : Int
origin = 1613944800000

-- "yyyyMMddThhmmssZ"
-- Monday of week 0 is 5h 22/02/2021, 1613944800000 in posix
toDate : Int -> Int -> Int -> String
toDate wday start week =
    let
        date = origin + week * 604800000 + (wday - 2) * 86400000
        startTime = millisToPosix <| date + start * 3600000
        dttm = String.padLeft 2 '0' << String.fromInt
        timestamp time =
            (List.map (List.map (\f -> dttm <| f time) >> String.join "")
                [ [ toYear utc
                , toMonth utc >> monthToInt
                , toDay utc]
                , [ toHour utc
                , toMinute utc
                , toSecond utc]
                ]
            |> String.join "T") ++ "Z"
    in
        timestamp startTime


monthToInt : Month -> Int
monthToInt month = case month of
    Jan -> 1
    Feb -> 2
    Mar -> 3
    Apr -> 4
    May -> 5
    Jun -> 6
    Jul -> 7
    Aug -> 8
    Sep -> 9
    Oct -> 10
    Nov -> 11
    Dec -> 12

