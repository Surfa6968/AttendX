import axios from "axios";

const API = "http://localhost/AttendX/backend/api/admin/classSession";

/*
|--------------------------------------------------------------------------
| Get All Class Sessions
|--------------------------------------------------------------------------
*/

export const getClassSessions = async () => {

    const res = await axios.get(

        `${API}/list.php`,

        {
            withCredentials: true
        }

    );

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Get Single Class Session
|--------------------------------------------------------------------------
*/

export const getClassSession = async (id) => {

    const res = await axios.get(

        `${API}/get.php?id=${id}`,

        {
            withCredentials: true
        }

    );

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Create Class Session
|--------------------------------------------------------------------------
*/

export const createClassSession = async (data) => {

    const res = await axios.post(

        `${API}/create.php`,

        data,

        {
            withCredentials: true
        }

    );

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Update Class Session
|--------------------------------------------------------------------------
*/

export const updateClassSession = async (id, data) => {

    const res = await axios.post(

        `${API}/update.php?id=${id}`,

        data,

        {
            withCredentials: true
        }

    );

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Delete Class Session
|--------------------------------------------------------------------------
*/

export const deleteClassSession = async (id) => {

    const res = await axios.post(

        `${API}/delete.php`,

        { id },

        {
            withCredentials: true
        }

    );

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Search Class Sessions
|--------------------------------------------------------------------------
*/

export const searchClassSessions = async (keyword) => {

    const res = await axios.get(

        `${API}/search.php?keyword=${encodeURIComponent(keyword)}`,

        {
            withCredentials: true
        }

    );

    return res.data;

};