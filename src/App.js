import { useEffect, useState } from 'react';
import './App.css';
import { TiCancelOutline } from "react-icons/ti";

function App() {
  const [data, setData] = useState([]);
  const [inputTask, setInputTask] = useState(null);

  const submitTask = (e) => {
    e.preventDefault();
    console.log(inputTask)
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: inputTask,
        completed: false,
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) => setData([json, ...data]));
  }

  const deleteRequest = (e) => {
    fetch('https://jsonplaceholder.typicode.com/todos?Id=1', {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((json) => console.log(json));
    console.log('ok');
  }

  useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((dat) => setData([...dat]));
  }, [])

  return (
    <div className="App">
      <div className='input-div'>
        <form>
          <div>
            <input type="text" onChange={(e) => setInputTask(e.target.value)} className='input-task' placeholder='Enter The task....' />
          </div>
          <div>
            <input type="submit" onClick={submitTask} className='submit-button' />
          </div>
        </form>
      </div>
      <div className='allTasks'>
        {data.map((item, index) => (
          <div style={{ display : item.userId === 1 ? 'display' : 'none'}} className='task' key={index}>
            <p style={{ textDecoration : item.completed ? 'line-through' : 'none'}}>{item.userId === 1 ? item.title : null } 
            <span onClick={deleteRequest}><TiCancelOutline /></span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
