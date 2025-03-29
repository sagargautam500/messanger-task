import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { fetchUsers } from './store/store';

function App() {
  const dispatch = useDispatch();
  const { users, page, status } = useSelector((state) => state.users);
  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current.scrollTop === 0 && status !== 'loading') {
      dispatch(fetchUsers(page));
    }
  }, [dispatch, page, status]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="messenger-container" ref={scrollRef}>
      {users.map((user, index) => (
        <div key={user.id} className={`message ${index % 2 === 0 ? 'incoming' : 'outgoing'}`}>
          <p><strong>{user.name}</strong>: {user.email}</p>
        </div>
      ))}
      {status === 'loading' && <p>Loading more messages...</p>}
    </div>
  );
}

export default App;