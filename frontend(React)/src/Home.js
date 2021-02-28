import React, {useState, useEffect} from 'react'
import {Link, Router} from 'react-router-dom'


const API = process.env.REACT_APP_API;

export const Home = () => {
    const [userid, setUserid] = useState('')
    const [password, setPassword] = useState('')
    const [login, setLogin] = useState(false)
    const [id, setId] = useState('')
    let Input1;
    let Input2;

    if(login){
        Input1 = <button className="btn btn-dark btn-block"><Link className="navbar-brand" to="/board">Board</Link></button>;
    }
    else {
        Input1 = <input 
        type="text" 
        className="form-control"
        placeholder="Userid"
        onChange={e => setUserid(e.target.value)}
        value={userid}
        autoFocus
        />;
        Input2 = <input 
        type="text" 
        className="form-control"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        value={password}
        />;
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const res = await fetch(`${API}/login`, {
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

        if(data['login'] == true) {
            setLogin(true);
            alert("로그인 성공");
        }
        else{
            setLogin(false);
            alert("로그인 실패");
        }
    }

    return(
        <div className="row">
            <div className="col-md-3">
                <h1>Software Engineering Project Login</h1>
                <form 
                    onSubmit={handleSubmit}
                    className="card card-body">
                    <div className="form-group">
                        {Input1}
                        {Input2}
                    </div>
                    <button className="btn btn-dark btn-block">
                        Login
                    </button>
                </form>
            </div>
        </div>  
    )
}