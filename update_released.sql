select c.*,
       datetime(cast(c.`release.released` as integer),'unixepoch') as `release.releaseDate`
from - as c
