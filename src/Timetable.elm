module Timetable exposing (Entry, Timetable, entryParser, parse)

import Parser exposing (..)
import Time exposing (..)


type alias Timetable =
    { semester : Int

    -- Year from
    , from : Int

    -- Year to
    , to : Int
    , entries : List Entry
    }



-- Entry


type alias Entry =
    { id : String
    , name : String
    , group : String
    , wday : Int
    , start : Int
    , end : Int
    , room : String
    , weeks : List Int
    }



-- example : String
-- example =
--     "CO1027\tKỹ thuật lập trình\t3\t--\tL04\t4\t11-12\t16:00 - 17:50\tH1-304\tBK-CS2\t--|09|10|11|12|13|14|15|--|17|18|"


parse : String -> Maybe Timetable
parse =
    Parser.run
        (Parser.succeed Timetable
            |. Parser.chompUntil "Học kỳ "
            |. Parser.token "Học kỳ "
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
                        , entryParser |> Parser.map (\entry -> Loop (entry :: entries))
                        , Parser.succeed (Done entries)
                        ]
                )
        )
        >> Result.toMaybe


entryParser : Parser Entry
entryParser =
    let
        cellChomper =
            chompWhile (\c -> c /= '\t')
    in
    succeed Entry
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
                , Parser.succeed (Done (List.reverse result))
                ]
        )
