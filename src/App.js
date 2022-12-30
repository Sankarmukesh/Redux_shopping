import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import axios from "axios";
import TodoList from "./components/todos/TodoList";
import DeletedTodo from "./components/deletedtodos/DeletedTodo";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/todos/Home";
import Login from "./components/login/Login";
import { useDispatch, useSelector } from "react-redux";
function App() {
  const data = useSelector((state) => state.loginReducer.logined);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "CHECK" });
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: "10px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {data === false ? (
              <Route path="login" element={<Login />} />
            ) : (
              <Route path="/" element={<Home />} />
            )}
            {data === true ? (
              <>
                <Route path="todos" element={<TodoList />} />
                <Route path="deleted" element={<DeletedTodo />} />
              </>
            ) : (
              <Route path="/" element={<Home />} />
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
