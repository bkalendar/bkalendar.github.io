module Converter exposing (timetableToEvents)

import Event exposing (Event)
import Random
import Time exposing (Posix)
import Timetable exposing (Entry, Timetable)
import Uuid exposing (Uuid)


timetableToEvents : (Event -> msg) -> Timetable -> Cmd msg
timetableToEvents toMsg timetable =
    List.map (\entry -> Random.generate toMsg (Random.map (\uuid -> timetableEntryToEvent timetable uuid entry) Uuid.uuidGenerator))
        timetable.entries
        |> Cmd.batch


timetableEntryToEvent : Timetable -> Uuid -> Entry -> Event
timetableEntryToEvent timetable uuid entry =
    let
        toPosix wday period week =
            Time.millisToPosix (Time.posixToMillis (Timetable.getDate week timetable) + (wday - 2) * 86400000 + (period + 5 - 7) * 3600000)

        ( firstWeek, weeks ) =
            entry.weeks
    in
    { uuid = uuid
    , subject = entry.name
    , description = "Mã môn: " ++ entry.id ++ "\\nMã lớp: " ++ entry.group
    , location = entry.room
    , start = toPosix entry.wday entry.start firstWeek
    , end = toPosix entry.wday (entry.end + 1) firstWeek
    , repeats = List.map (toPosix entry.wday entry.start) weeks
    }
