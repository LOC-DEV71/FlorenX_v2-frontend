import { TypeAnimation } from 'react-type-animation';


function TypingAnimation({ title }) {
  return (
    <TypeAnimation
        sequence={[
            title,
            1000,
        ]}
        speed={50}
        repeat={Infinity}
    />
  );
}

export default TypingAnimation