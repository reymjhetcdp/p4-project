import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Task Management App!</h1>
      <p>Start tracking your tasks!</p>
      <ul>
        <li className="italicized">
          <span>Already have an account? </span>
          <Link to="/login">Login here!</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
