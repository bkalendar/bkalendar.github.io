module Class exposing (Class)

import Time exposing (Posix)

type alias Class =
    { title : String
    , desp : String
    , room : String
    , start : Posix
    , end : Posix
    }