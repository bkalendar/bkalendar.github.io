module Class exposing (Class, parser, example)

import Parser exposing ((|=), (|.), Parser, chompWhile, succeed, getChompedString, symbol, int, loop, Step(..))
import Time exposing (Posix, millisToPosix)
import Parser exposing (oneOf)

type alias Class =
    { title : String
    , desp : String
    , room : String
    , wday : Int
    , start : Int
    , end : Int
    , exclude : List Int
    }

example = "CO1027	Kỹ thuật lập trình	3	--	L04	4	11-12	16:00 - 17:50	H1-304	BK-CS2	--|09|10|11|12|13|14|15|--|17|18|"

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
            [ Parser.succeed (Loop (index + 1, index::result))
                |. symbol "--|"
            , Parser.succeed (Loop (index + 1, result))
                |. symbol "0"
                |. int
                |. symbol "|"
            , Parser.succeed (Loop (index + 1, result))
                |. int
                |. symbol "|"
            , Parser.succeed (Done result)
            ]
    )

toEvent : String -> Class -> String
toEvent uuid class =
"""BEGIN:VEVENT
SUMMARY: """ ++ class.title ++ """
DESCRIPTION: """ ++ class.desp ++ """
LOCATION: """ ++ class.room ++ """
DTSTART:
DTEND:
EXDATE:
RRULE:FREQ=WEEKLY
END:VEVENT"""