import React, { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthStore/store";
import { Navigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import {
    GridRowModes, DataGrid,
    GridToolbarContainer, GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { fetchData } from "../API/api";
import {
    Add as AddIcon, Edit as EditIcon,
    DeleteOutlined as DeleteIcon, Save as SaveIcon,
    Close as CancelIcon
} from '@mui/icons-material';

function EditToolbar(props) {
    const { setUsersList, setRowModesModel, isAdmin, } = props;

    const handleClick = () => {
        const id = "null";
        setUsersList((oldRows) => [...oldRows, { id : "null", firstName: '', lastName: '', email: "",
         mobile: "", profession: "", address: "", isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'firstName' },
        }));
    };

    return (
        <GridToolbarContainer>
            {isAdmin && <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>}
            <Typography variant="h4" alignContent={"center"} alignSelf={"center"} sx={{ width: "80%" }}>
                Users List
            </Typography>
        </GridToolbarContainer>
    );
}

const Dashboard = () => {
    const { token, isAdmin,setAuth } = useContext(AuthContext);
    const [usersList, setUsersList] = useState([]);
    const [columnVisibilityModel, onColumnVisibilityModelChange] = useState({
        actions: isAdmin,
    });
    const [rowModesModel, setRowModesModel] = useState({});
    const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 })
    const fetchUsersList = useCallback((token, pageModel) => {
        fetchData(`http://localhost:5000/users/?pageNo=${pageModel.page + 1}&pageSize=${pageModel.pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                token
            },
        }).then((response) => {
            if (response.msg === 'SUCCESS') {
                setUsersList(response.asset);
            } else {
                console.log(response, "LIST RESP ERR")
            }
        })
            .catch((err) => console.log(err, "ERR"))
    }, [])

    const editUser = (id, data) => {
        delete data.id;
        fetchData(`http://localhost:5000/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                token,
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.msg === 'SUCCESS') {
                let editedIndex = usersList.findIndex((row) => row.id === id);
                let newDataList = usersList.slice();
                newDataList[editedIndex] = {...data,id};
                setUsersList(newDataList)
            } else {
                fetchUsersList(token, paginationModel)
                console.log(response, "EDIT RESP ERR")
            }
        })
    }
    
    const createUser=(newData)=>{
        newData.password = newData.firstName+newData.lastName;
        delete newData.id;
        delete newData.isNew;
        fetchData(`http://localhost:5000/auth/signup`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newData)
        }).then((response)=>{
            // if response is success or failure , anyways this api will be fetching the latest list
                fetchUsersList(token,paginationModel)
        }).catch(console.log)
    }
    
    const handleRowEditStop = (params, event) => {
        if (Object.values(GridRowEditStopReasons).includes(params.reason)) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setUsersList(usersList.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = usersList.find((row) => row.id === id);
        if (editedRow.isNew) {
            setUsersList(usersList.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        // console.log(updatedRow, "UPD")
        if(newRow.id !== "null"){
            editUser(newRow.id,newRow);
        }else{
            createUser(newRow)
        }
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columnFields = [
        { field: "firstName", headerName: "First Name", minWidth: 150, editable: isAdmin },
        { field: "lastName", headerName: "Last Name", minWidth: 200, editable: isAdmin },
        { field: "email", headerName: "Email", minWidth: 200, editable: isAdmin },
        { field: "mobile", headerName: "Mobile", minWidth: 150, editable: isAdmin },
        { field: "profession", headerName: "Profession", minWidth: 150, editable: isAdmin },
        { field: "address", headerName: "Address", width: 120, editable: isAdmin },
        { field: "userRole", headerName: "Role", width: 120, editable: isAdmin, type: "singleSelect", valueOptions: ['admin', 'user'] },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            hideable: false,
            disableColumnMenu: true,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    useEffect(() => {
        if (token)
            fetchUsersList(token, paginationModel);
    }, [fetchUsersList, token, paginationModel]);

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return (
        <Fragment>
            <Grid
                container
                spacing={3}
                alignItems="center"
                sx={{
                    justifyContent: "center",
                    display: "flex",
                    margin: "4em 0em 5em 0em",
                    top: "5em",
                    width: "100%",
                }}
            >
                <Grid item sx={{ display: "flex", width: "80%", justifyContent: "flex-end" }}>
                    <Button variant="contained" color="error" onClick={()=>setAuth({})} >Logout</Button>
                </Grid>
                <Grid item sx={{ minWidth: "65%" }}>
                    <DataGrid
                        rows={usersList}
                        columns={columnFields}
                        sx={{
                            // disable cell selection style
                            ".MuiDataGrid-cell:focus": {
                                outline: "none",
                            },
                            // pointer cursor on ALL rows
                            "& .MuiDataGrid-row:hover": {
                                cursor: "pointer",
                            },
                        }}

                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                            columns: {
                                columnVisibilityModel: columnVisibilityModel,
                            },
                        }}
                        pageSizeOptions={[10, 20, 50]}
                        onColumnVisibilityModelChange={onColumnVisibilityModelChange}
                        editMode="row"
                        rowModesModel={rowModesModel}
                        onRowModesModelChange={handleRowModesModelChange}
                        onRowEditStop={handleRowEditStop}
                        processRowUpdate={processRowUpdate}
                        slots={{
                            toolbar: EditToolbar,
                        }}
                        slotProps={{
                            toolbar: { setUsersList, setRowModesModel, isAdmin },
                        }}
                        onRowDoubleClick={(row, event) => event.defaultMuiPrevented = true}
                        onCellClick={(row, event) => event.defaultMuiPrevented = true}
                        onCellDoubleClick={(row, event) => event.defaultMuiPrevented = true}
                        disableRowSelectionOnClick
                        onPaginationModelChange={(pageArgs) => setPaginationModel(pageArgs)}
                    />
                </Grid>
            </Grid>
        </Fragment>
    )
}

export default Dashboard;