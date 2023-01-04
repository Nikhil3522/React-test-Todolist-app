import { useEffect, useState } from 'react';
import './App.css';
import { TiDelete } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";

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
    fetch('https://jsonplaceholder.typicode.com/todos/id=2', {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
    console.log('ok');
  }

  const completedTask = (e) => {
    fetch('https://jsonplaceholder.typicode.com/todos/id=1', {
    method: 'PATCH',
    body: JSON.stringify({
      completed: 'true',
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => response.json())
  .then((json) => console.log(json));
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
            <p>
              <span onClick={completedTask}><AiOutlineCheckCircle className='checkCircleIcon' /></span>
            </p>
            <p 
              style={{ textDecoration : item.completed ? 'line-through' : 'none'}}
              className='task-title'
            >
              {item.userId === 1 ? item.title : null } 
            </p>
            <p>
              <span onClick={deleteRequest}><TiDelete className='deleteIcon' /></span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
