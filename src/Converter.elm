module Converter exposing (timetableToEvents)

import Event exposing (Event)
import Random
import Time exposing (Posix)
import Timetable exposing (Timetable, TimetableEntry)
import Uuid exposing (Uuid)


week33Local : Int
week33Local =
    1629046800000


timetableToEvents : (Event -> msg) -> Timetable -> Cmd msg
timetableToEvents toMsg { entries } =
    List.map (\entry -> Random.generate toMsg (Random.map (\uuid -> timetableEntryToEvent uuid entry) Uuid.uuidGenerator))
        entries
        |> Cmd.batch


timetableEntryToEvent : Uuid -> TimetableEntry -> Event
timetableEntryToEvent uuid entry =
    let
        toPosix wday period week =
            Time.millisToPosix (week33Local + week * 604800000 + (wday - 2) * 86400000 + (period + 5) * 3600000)

        firstWeek =
            List.head entry.weeks |> Maybe.withDefault 0
    in
    { uuid = uuid
    , subject = entry.name
    , description = "Mã môn: " ++ entry.id ++ "\nMã lớp: " ++ entry.group
    , location = entry.room
    , start = toPosix entry.wday entry.start firstWeek
    , end = toPosix entry.wday (entry.end + 1) firstWeek
    , repeats = List.map (toPosix entry.wday entry.start) entry.weeks
    }
