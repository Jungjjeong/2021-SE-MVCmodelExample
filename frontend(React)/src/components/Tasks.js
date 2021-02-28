import React, {useState, useEffect} from 'react'

const API = process.env.REACT_APP_API;

export const Tasks = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [picture_url, setPicture_url] = useState('')
  const [tasks, setTasks] = useState([])
  const [editing, setEditing] = useState(false)
  const [id, setId] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!editing) {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          picture_url
        })
      })
      const data = await res.json()
      console.log(data)
    } else {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
          picture_url
        })
      })
      setEditing(false);
      setId('')
    }
    

    await getTasks();
    setTitle('')
    setContent('')
    setPicture_url('')
  }

  const getTasks = async () => {
    const res = await fetch(`${API}/tasks`)
    const data = await res.json()
    console.log(data)
    setTasks(data)
  }

  const deleteTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    console.log(data)
    await getTasks()
  }

  const editTask = async id => {
    const res = await fetch(`${API}/task/${id}`)
    const data = await res.json()

    setEditing(true);
    setId(id)

    setTitle(data.title)
    setContent(data.content)
    setPicture_url(data.picture_url)
  }

  useEffect(() => {
    getTasks()
  }, [])

  return (
    <div className="row">
      <div className="col-md-3">
        <form 
          onSubmit={handleSubmit}
          className="card card-body">
          <div className="form-group">
            <input 
              type="text" 
              className="form-control"
              placeholder="Title"
              onChange={e => setTitle(e.target.value)}
              value={title}
              autoFocus
              />
            <input 
              type="text" 
              className="form-control"
              placeholder="Content"
              onChange={e => setContent(e.target.value)}
              value={content}
              autoFocus
              />
            <input 
              type="text" 
              className="form-control"
              placeholder="Picture URL"
              onChange={e => setPicture_url(e.target.value)}
              value={picture_url}
              autoFocus
              />
          </div>
          <button className="btn btn-dark btn-block">
            {editing ? 'EDIT' : 'ADD'}
          </button>
        </form>
      </div>
      <div className="col-md-9">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Picture</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.content}</td>
                <td><img src={task.picture_url}></img></td>
                <td className="d-flex">
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => editTask(task._id)}>Edit</button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => deleteTask(task._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
