import MiniReactDOM from '../index.js';

function App(props) {
  const [count, setCount] = MiniReactDOM.useState(0);
  return MiniReactDOM.createElement(
    'h1', 
    { 
      title: 'foo',
      onClick: () => {
        setCount(s => s + 1)
      }
    }, 
    'Hi',
    `${props.name}: ${count}`
  );
}

const element = MiniReactDOM.createElement(App, { name: 'qiugu' });

export default element;
