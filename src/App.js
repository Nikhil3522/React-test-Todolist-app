import { useEffect, useState } from 'react';
import './App.css';
import { TiDelete } from "react-icons/ti";
import { AiOutlineCheckCircle, AiOutlineFileDone } from "react-icons/ai";
import { TiEdit } from "react-icons/ti";
import { SyncLoader } from 'react-spinners'; 

function App() {
  const [data, setData] = useState([]);  // data state store all the tasks.
  const [inputTask, setInputTask] = useState(null); // inputTask state store the task filled by user in the input field.
  const [ showLoading, setShowLoading ] = useState(false); // showLoading state is reponsible for loader. If showLoading state is true that means loading display and if showLoading state is false that means loading disable.
  const [ editTask, setEditTask] = useState(null);
  const [ editTaskDetail, setEditTaskDetail] = useState(''); // store the edit task detail

  // This function call the API in post method and add the task in data state.
  const submitTask = async (e) => {
    e.preventDefault();
    setShowLoading(true); // I started showing the loader from this line and disable at 30th line, I used await for Post the task, so that our task will be added before disable of loader.
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

  // This function call the API in delete method and delete the selected task.
  const deleteRequest = (id , e) => {
    fetch('https://jsonplaceholder.typicode.com/todos/id=2', {
      method: 'DELETE',
    })
    .then((response) => response.json())
    .then((json) => setData([...data.slice(0, id), ...data.slice(id+1, data.length)]))
    .catch((err) => console.log(err));
  }

  const updateTask = async (id, title) => {
    await fetch(`https://jsonplaceholder.typicode.com/todos/id=${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        userId: 1,
        id,
        title,
        completed: false
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((response) => response.json())
    .then((json) => setData([...data.slice(0,id-1), json, ...data.slice(id, 21)]));

    setEditTaskDetail(null);
  }

  // This useeffect function update all tasks id in sequence ascending order.
  useEffect( () => {
    data.map((item, index) => {
      item.id = index
    });
  }, [data]);

  // This function change the completed variable as true of selected task..
  const completedTask = (id, title, e) => {
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

  // This useEffect function run only one time. This function save all the tasks present in the API into data state.
  useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/todos')
      .then((res) => res.json())
      .then((dat) => setData([...dat]));
  }, [])

  return (
    <div className="App">
      {/* form div */}
      <div className='input-div'>
        <form>
          <div>
            <input type="text" onChange={(e) => (setInputTask(e.target.value), e.target.value='')} className='input-task' value={inputTask} placeholder='Enter The task....' />
          </div>
          <div>
            <button onClick={submitTask} className='submit-button'>{showLoading ? <SyncLoader color="white" size="9" loading={showLoading} /> : 'Add Task'}</button>
          </div>
        </form>
      </div>

      {/* Tasks div */}
      <div className='allTasks'>
        {data.map((item, index) => (
          <div style={{ display : item.userId === 1 ? 'display' : 'none'}} className='task' key={index}>
            <p>
              <span onClick={() => completedTask(item.id+1, item.title)}>{ !item.completed ? <AiOutlineCheckCircle className='checkCircleIcon' />: null}</span> {/* This is checked icon, If user click on checked icon then completedTask function will be call. */}
            </p>
            {
              item.id === editTask ?
              (
              <div><input type="text" value={editTaskDetail} onChange={(e) => (setEditTaskDetail(e.target.value), e.target.value='')} /> <AiOutlineFileDone onClick={() => updateTask(item.id+1, editTaskDetail)} /></div>)
              :
             ( <p 
                style={{ textDecoration : item.completed ? 'line-through' : 'none'}}  // I used ternary operator logic here for insert the textDecoration value.
                className='task-title'
              >
                {item.userId === 1 ? item.title : null } 
              </p>)
            }

            <div className='right-icon'>
              <p>
                <span onClick={() => setEditTask(item.id)}><TiEdit className='editIcon' /></span>
              </p>
              <p>
                <span onClick={() => deleteRequest(item.id)}><TiDelete className='deleteIcon' /></span>  {/* This is delete icon, If user click on delete icon then deleteRequest function will be call. */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
