import { Player, Team } from './models';
import { getTeam } from './services/getTeam';
import xray from 'x-ray';
import { DateTime } from 'luxon';

const x = xray();

const team: Team = await getTeam();
const hitters: Player[] = team.hitters;
const pitchers: Player[] = team.pitchers;

pitchers.map((pitcher: Player) => {
  const starts = pitcher.starterStatusByProGame;
  for (const gameId in starts) {
    if (starts[gameId] === 'PROBABLE') {
      const url = `https://www.espn.com/mlb/game?gameId=${gameId}`;
      x(url, {
        date: 'title',
        pitchers: ['.pitchers__row .fullName'],
      })((err: any, result: any) => {
        if (err) return `ERROR ${err}`;
        else if (result.pitchers.length > 0) formatEspnTitle(result.date, (newDate: any) => {
          console.log(newDate, result.pitchers);
        });
      });
    }
  }
});

const formatEspnTitle = (date: string, callback: Function) => {
  const sliced = date.split(' - ');
  callback(sliced[0] + ' - ' + sliced[2]);
};

export { };