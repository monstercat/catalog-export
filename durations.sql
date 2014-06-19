select c.*,d.duration as `track.duration`,
           d.duration_seconds as `track.duration_seconds`
from ./monstercat_catalog.csv as c
inner join ./durations.csv as d
on d.filename = c.`track.fileName`
