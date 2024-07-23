export const WrapperH = (props:{children: JSX.Element[] | JSX.Element, id?: string, width?: string, height?: string, className?: string}) =>{
  let idCheck = (props.id) ? `${props.id}`: '';
  let widthCheck = (props.width) ? props.width: 'auto';
  let heightCheck = (props.height) ? props.height: 'auto';
  return (
    <div id={idCheck} className={'flex flex-row min-w-fit items-center justify-between ' + `w-[${widthCheck}] h-[${heightCheck}] ` + props.className}>
      {props.children}
    </div>
  );
}


export const WrapperV = (props:{children: JSX.Element[] | JSX.Element, id?: string, width?: string, height?: string, className?: string}) =>{
  let idCheck = (props.id) ? `${props.id}`: '';
  let widthCheck = (props.width) ? `w-[${props.width}]`: 'w-[100%]';
  let heightCheck = (props.height) ? `h-[${props.height}]`: 'h-auto';
  return (
    <div id={idCheck} className={`flex flex-col items-center pt-[5px] pb-[5px] ` + widthCheck + ' ' + heightCheck + ' ' + ( props.className? props.className : ``)}>
      {props.children}
    </div>
  );
}