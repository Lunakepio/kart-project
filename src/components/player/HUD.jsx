import { Laps } from "./Laps";
import TimerComponent from "./Timer";
import { useStore } from "./store/store";

export const HUD = () => {
  const { lapNotValidated } = useStore();
  return (
    <div className="hud">
      <Laps />
      {lapNotValidated && <h1>Lap not validated</h1>}
      <TimerComponent />
    </div>
  );
};
