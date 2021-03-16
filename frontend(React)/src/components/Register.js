import React, {useState} from 'react'

const API = process.env.REACT_APP_API;

export const Register = () => {
    const [userid, setUserid] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        const res = await fetch(`${API}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userid,
              password
            })
        })
        const data = await res.json()
        console.log(data)

        setUserid('')
        setPassword('')
    } 
    
    return(
      <div className="row">
        <div className="col-md-3">
          <h1>회원가입</h1>
          <form 
            onSubmit={handleSubmit}
            className="card card-body">
            <div className="form-group">
              <input 
                type="text" 
                className="form-control"
                placeholder="Userid"
                onChange={e => setUserid(e.target.value)}
                value={userid}
                autoFocus
                />
              <input 
                type="text" 
                className="form-control"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                />
            </div>
            <button 
              className="btn btn-dark btn-block">Sign Up</button>
          </form>
        </div>
      </div>  
    )
}