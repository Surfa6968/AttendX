import axios from "axios";

const API = "/api/lecturer/timetable";


/*
|--------------------------------------------------------------------------
| Get Lecturer Timetable
|--------------------------------------------------------------------------
*/

export const getLecturerTimetable = async () => {

    try {

        const response = await axios.get(
            `${API}/get.php`,
            {
                withCredentials: true,
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "LECTURER TIMETABLE SERVICE ERROR:",
            error
        );

        throw error;
    }
};