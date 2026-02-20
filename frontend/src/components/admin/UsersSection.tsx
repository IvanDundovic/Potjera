import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  activeSection: string | null;
  setActiveSection: React.Dispatch<React.SetStateAction<string | null>>;
}

interface UserDto{
    id: number,
    role: string,
    email: string,
    username: string
};

const UserSection = ({activeSection, setActiveSection} : Props) => {
      const isOpen = activeSection === "users";
    const [users, setUsers] = useState<UserDto[] | undefined>(undefined);
    async function fetchUsers() {
        axiosInstance.get("api/v1/Auth/getUsers")
        .then((response) => {
            setUsers(response.data.users)
        }).catch((error) =>{
            console.log(error);
        })
    }

    useEffect(() => {
        if(isOpen) fetchUsers();
    }, [isOpen]);

    return (
  <div className="accordion game-accordion" id="accordionExample">
    <div className="accordion-item game-main-item">
      <h2 className="accordion-header">
        <button
          className={`accordion-button game-main-button ${
            isOpen ? "" : "collapsed"
          }`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseTwo"
          aria-expanded={isOpen}
          aria-controls="collapseTwo"
          onClick={() => setActiveSection(isOpen ? null : "users")}
        >
          KORISNICI
        </button>
      </h2>

      <div
        id="collapseTwo"
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body game-main-body">
          {users?.map((user) => (
            <div></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

}

export default UserSection;