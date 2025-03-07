import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/Store/User";
import { ToastMessage } from "../Home/ToastMessage";
import { BACKEND_END_POINT } from "@/utils/Constants";
import { useState } from "react";

export default function LoginTrigger() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProfile, setShowProfile] = useState(false);
  
  const handlelogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_END_POINT}/logout`, {
        withCredentials: true,
      }).catch((error) => {
        ToastMessage("Error", error.response.data.message || "An error occurred while Logging OUT! ");
      });

      if (response.data.success) {
        ToastMessage("Logged out", "You have successfully logged out");
        dispatch(setUser(null));
        navigate("./auth");
      }
    } catch (error) {
      ToastMessage("Error", error.message);
    }
  };

  const { user } = useSelector(store => store.user);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="p-1 w-70">
          <p className="m-2">Shadcn</p>
          <hr className="mb-1" />
          <Button variant="outline" className="w-full border-none" onClick={toggleProfile}>
            Profile
          </Button>
          <Button variant="outline" className="w-full border-none" onClick={handlelogout}>
            Logout
          </Button>
        </PopoverContent>
      </Popover>

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={toggleProfile}>
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 m-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-800 text-center">
              Profile Details
            </h2>
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                <strong>Name:</strong> {user && user.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {user && user.email}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {user && user.phone}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={toggleProfile}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}