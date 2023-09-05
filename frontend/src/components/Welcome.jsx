import { useEffect, useState } from "react";

function Welcome() {
  const [user, setUser] = useState(null);

  const URL = import.meta.env.VITE_REACT_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          setUser(data);
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello, {user.name}</h1>
    </div>
  );
}

export default Welcome;
