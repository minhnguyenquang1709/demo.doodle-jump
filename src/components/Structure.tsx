export const Header = (props:{children: JSX.Element[] | JSX.Element}) => {
  return (
    <div id='header' className='flex flex-row justify-end items-center min-w-screen h-[4.5rem]'>
      {props.children}
    </div>
  );
}

export const Body = (props:{children: JSX.Element[] | JSX.Element, className?: string}) => {
  return (
    <div className={`flex flex-col justify-center items-center h-[85vh]`}>
      {props.children}
    </div>
  );
}