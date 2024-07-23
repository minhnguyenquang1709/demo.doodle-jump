import { emitter } from "../Game";

export const GameOverScreen = (props:{children?: JSX.Element[] | JSX.Element, score: number, className?: string}) =>{
  const emitRetry = () =>{
    emitter.emit('retry');
  }

  // const emitExit = () =>{
  //   emitter.emit('exit');
  // }

  return (
    <div className={" h-full w-full m-auto flex flex-col justify-center items-center bg-opacity-60 z-1 bg-white" + ` ${props.className}`}>
      <h1 className=" text-neutral-900">{props.score}</h1>
      <button className=" w-32 h-20 rounded bg-green-400" onClick={emitRetry}>Retry</button>
      {/* <button className=" w-32 h-20 rounded bg-red-500" onClick={emitExit}>Exit</button> */}
    </div>
  );
}