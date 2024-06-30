import { useRef, useState,useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';


function App() {
  
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([])
  const addBtn = useRef()
  const [showFinished, setShowFinished] = useState(true)
  
  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if(todoString){
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos)
    }
  }, [])
  
  const handleAdd = () => {
    if(todo!=""){
      setTodos([...todos,{id:uuidv4(),todo,isCompleted:false,edit:false}])
      setTodo("")
    }
    saveToLS()
  }
  const handleEdit = (e,id) => {
     addBtn.current.style.visibility = "hidden";
    let newTodos = todos.filter(val=>{
      return val.id==id;
    })
    newTodos[0].edit = true;
    setTodo(newTodos[0].todo)
   
  }
  const saveToLS =()=>{
    localStorage.setItem("todos",JSON.stringify(todos));
    
  }

  const handleSave = (e,id)=>{
    let newTodos = [...todos]
    let idx = newTodos.findIndex(val=>val.id == id);
    newTodos[idx].todo = todo;
    newTodos[idx].edit = false;
    setTodos(newTodos)
    setTodo("")
    addBtn.current.style.visibility = "visible";
    saveToLS();
  }
  const handleDelete = (e,id) => {
    let newTodos =todos.filter(val=>val.id!=id)
    setTodos(newTodos)
    saveToLS();
  }
  const handleChange = (e) => {
    setTodo(e.target.value)
  }
  const handleCheckbox = (e) => {
    let id = e.target.name;
    let findId = todos.findIndex(val=>val.id==id)
    let newTodos = [...todos];
    newTodos[findId].isCompleted = !newTodos[findId].isCompleted;
    setTodos(newTodos) 
    saveToLS();
  }
  const handleShowFinished = ()=>{
    setShowFinished(!showFinished)
  }
  const handleDeleteAll = ()=>{
    if(confirm("This will delete all tasks")){
      localStorage.clear()
    alert("All data cleared")
    }
    
  }

  return (
    <>
      <div className='w-full h-12 bg-emerald-400 px-6  flex justify-around items-center'>
        <h2 className='font-semibold bg-slate-800 text-xl text-emerald-400 px-3 py-1 rounded-md'>Tasks</h2>
        <ul className="flex items-center gap-4">
          <li className='cursor-pointer hover:font-medium transition-all font-semibold'>Home</li>
          <li className='cursor-pointer hover:font-medium transition-all font-semibold '>Your tasks</li>
        </ul>
      </div>
      <div className='m-auto rounded-lg bg-emerald-100 w-[90%] min-h-[80vh] px-4 py-3 my-3 text-center'>
        <h2 className='text-xl font-medium'>TODO LIST </h2>
        <input className='addTodo md:3/5 lg:w-2/5 w-4/5 rounded-lg bg-white px-3 py-2 text-lg block m-auto mt-3' type="text" name="todo" id="" onChange={handleChange} value={todo} placeholder='Task name' />
        <button ref={addBtn} className=  "mt-4 px-2 py-1 rounded-lg bg-emerald-500 font-semibold text-white"  onClick={handleAdd} type="submit">add task</button>
        

        <div className=' bg-green-300 text-start w-full md:4/5 lg:w-4/6 m-auto px-3 rounded-lg py-2 my-3 '>
          <h2 className='font-bold text-lg my-3 ml-5'>YOUR TASKS </h2>
          {todos.length==0 && <div className='ml-4'>NO TASKS</div>}

         {todos.length>0 && <><input type="checkbox" checked={showFinished} onChange={handleShowFinished} name="" id="" /><span>  show Finished</span></>}
          
          {todos.map((file)=>{
           return (showFinished ||!file.isCompleted )&&<div className=' bg-white rounded-md p-2 justify-between min-h-12  m-auto my-3 flex items-center' key={file.id}>
            <div className="text flex">
            <input className='mx-2' checked={file.isCompleted} onChange={handleCheckbox} type="checkbox" name={file.id} id="" />
            {/* {console.log(file.isCompleted)} */}
            <span className={file.isCompleted?"line-through":""}>{file.todo}</span>
            </div>
            <span className="bt px-2 flex right-3">
            {file.edit? <button className='mx-2  px-2 py-1 rounded-lg bg-emerald-500 font-semibold text-white' onClick={(e)=>handleSave(e,file.id)} type="submit">save</button>:
              <button className='mx-2  px-3 py-1 rounded-lg bg-blue-500 font-semibold text-white' type="button" onClick={(e)=>{handleEdit(e,file.id)}}>Edit</button>
              }
              <button className='mx-2 px-2 py-1 rounded-lg bg-red-500 font-semibold text-white' type="button" onClick={(e)=>{handleDelete(e,file.id)}}>delete</button>
            </span>
          </div>
          })}
          {todos.length>0 &&<button className='mx-2 px-2 py-1 rounded-lg bg-red-500 font-semibold text-white' type="button" onClick={handleDeleteAll}>Delete All</button>}
        </div>
      </div>
    </>
  )
}

export default App


//things to remember
//line 27 we need to create a reference shallow copy vs spread deep copy
//Using Local Stirage in line 25