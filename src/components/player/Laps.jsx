import { useStore } from "./store/store";

function getMilisecondTimeDifference(time1, time2) {
  const difference = time1 - time2;

  const seconds = Math.abs(Math.floor(difference / 1000));
  const milliseconds = Math.abs(difference % 1000);

  const formattedMilliseconds = milliseconds.toString().padStart(3, "0");

  return `${seconds}:${formattedMilliseconds}`;
}

export const Laps = () => {
  const { laps, PB } = useStore();

  return (
    <div className="laps">
      <div className="best">
        <span>PB</span>
        {PB ? <h6>{PB.lapTime}</h6> : <h6>0:00:00</h6>}
      </div>
      <div className="title">LAST LAPS</div>
      {laps.map((lap, index) => {
        return (
          <div key={index} className="lap">
            <div className="lapcount">{lap.lapNumber}</div>
            <div className={`time ${index % 2 === 0 ? "even" : "odd"}`}>
              {lap.lapTime}
            </div>
            {PB && (
              <>
                <div
                  className={`pbdiff ${lap.time === PB.time ? "pb" : ""} ${
                    index % 2 === 0 ? "even" : "odd"
                  }`}
                >
                  + {getMilisecondTimeDifference(lap.time, PB.time)}
                </div>
                {lap.time === PB.time && <div className="ispb">PB</div>}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
