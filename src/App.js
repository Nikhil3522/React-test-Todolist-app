import { useEffect, useState } from 'react';
import './App.css';
import { TiDelete } from "react-icons/ti";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { SyncLoader } from 'react-spinners';

function App() {
  const [data, setData] = useState([]);
  const [inputTask, setInputTask] = useState(null);
  const [ showLoading, setShowLoading ] = useState(false);

  const submitTask = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    await fetch('https://jsonplaceholder.typicode.com/todos', {
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
    setInputTask('');
    setShowLoading(false);
  }

  const deleteRequest = (id , e) => {
    fetch('https://jsonplaceholder.typicode.com/todos/id=2', {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((json) => setData([...data.slice(0, id), ...data.slice(id+1, data.length)]))
    .catch((err) => console.log(err));

    console.log('data', data);
  }

  useEffect( () => {
    console.log('old', data);
    data.map((item, index) => {
      item.id = index
    });
    console.log('new', data);
  }, [data]);

  const completedTask = (id, title, e) => {
    // console.log(id);
    fetch(`https://jsonplaceholder.typicode.com/todos/id=${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      userId: 1,
      id,
      title,
      completed: true
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => response.json())
  .then((json) => setData([...data.slice(0,id-1), json, ...data.slice(id, 21)]));
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
            <input type="text" onChange={(e) => (setInputTask(e.target.value), e.target.value='')} className='input-task' value={inputTask} placeholder='Enter The task....' />
          </div>
          <div>
            <button onClick={submitTask} className='submit-button'>{showLoading ? <SyncLoader color="white" size="9" loading={showLoading} /> : 'Add Task'}</button>
            {/* <input type="submit" value={`${<SyncLoader color="red" />`} onClick={submitTask} className='submit-button' /> */}
          </div>
        </form>
      </div>
      <div className='allTasks'>
        {data.map((item, index) => (
          <div style={{ display : item.userId === 1 ? 'display' : 'none'}} className='task' key={index}>
            <p>
              <span onClick={() => completedTask(item.id+1, item.title)}><AiOutlineCheckCircle className='checkCircleIcon' /></span>
            </p>
            <p 
              style={{ textDecoration : item.completed ? 'line-through' : 'none'}}
              className='task-title'
            >
              {item.userId === 1 ? item.title : null } 
            </p>
            <p>
              <span onClick={() => deleteRequest(item.id)}><TiDelete className='deleteIcon' /></span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
