import React, { useState, useEffect } from 'react';
import { Button, Stack, Text } from 'rsuite';

function Timer({time, task}) {
  const [timeLeft, setTimeLeft] = useState(time); // 10 minutes in seconds
  const [timerOn, setTimerOn] = useState(true); // Timer is initially on
  const [taskPerformed, setTaskPerformed] = useState(false); // Track whether the task has been performed

  // useEffect hook to handle the timer countdown
  useEffect(() => {
    if (timerOn && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      // Cleanup function to clear the interval when component unmounts or timer stops
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !taskPerformed) {
      // Perform a task when the timer reaches 0 (10 minutes elapsed) and the task hasn't been performed yet
    //   performTask();
    task();
      setTaskPerformed(true); // Mark the task as performed
      setTimerOn(false); // Stop the timer
    }
  }, [timerOn, timeLeft, taskPerformed]); // Depend on timerOn, timeLeft, and taskPerformed

  // Function to handle the task to be performed after the timer ends
//   const performTask = () => {
    // console.log('Time is up! Perform your task here.');
    // You can replace the console.log statement with any task you want to perform
//   };

  // Function to format remaining time in MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Stack justifyContent='center' >
       <div disabled style={{backgroundColor: '#95967A', padding:'10px', borderBottomLeftRadius:'10px',borderBottomRightRadius:'10px'}} align='center'>Session : {formatTime(timeLeft)}</div>
    </Stack>
  );
}

export default Timer;
