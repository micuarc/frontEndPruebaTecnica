import { useEffect, useState } from "react";
import "./App.css";
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DataGrid, esES } from "@mui/x-data-grid";
import ModalAgregar from "./components/ModalAgregar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "20%",
  height: "45%",
  bgcolor: "background.paper",
  boxShadow: 24,
  paddingBottom: 7,
  paddingLeft: 4,
  paddingRight: 4,
};

function App() {
  const [marcas, setMarcas] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [bodegaElegida, setBodegaElegida] = useState(null);
  const [marcaElegida, setMarcaElegida] = useState(null);
  const [modeloElegido, setModeloElegido] = useState(null);
  const [abrir, setAbrir] = useState(false);

  const columnas = [
    {
      field: "idDispositivo",
      headerName: "ID",
      width: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nombreDispositivo",
      headerName: "Nombre Dispositivo",
      align: "center",
      headerAlign: "center",
      width: 160,
    },
    {
      field: "nombreModelo",
      headerName: "Modelo",
      width: 160,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nombreMarca",
      headerName: "Marca",
      align: "center",
      headerAlign: "center",
      width: 160,
    },
    {
      field: "nombreBodega",
      headerName: "Bodega",
      width: 160,
      align: "center",
      headerAlign: "center",
    },
  ];

  const getBodega = async () => {
    const api = await fetch(`${process.env.REACT_APP_API_REST}bodega/listar`);
    const data = await api.json();
    const listaBodegas = data.datos.map((bodega) => {
      console.log(bodega);
      return { label: bodega.nombreBodega, id: bodega.idBodega };
    });
    setBodegas(listaBodegas);
  };

  const getMarca = async () => {
    const api = await fetch(`${process.env.REACT_APP_API_REST}marca/listar`);
    const data = await api.json();
    const listaMarcas = data.datos.map((marca) => {
      console.log(marca);
      return { label: marca.nombreMarca, id: marca.idMarca };
    });
    setMarcas(listaMarcas);
  };
  const getModelo = async () => {
    if (marcaElegida != null) {
      const api = await fetch(
        `${process.env.REACT_APP_API_REST}modelo/listar?idMarca=${marcaElegida.id}`
      );
      const data = await api.json();
      const listaModelos = data.datos.map((modelo) => {
        return { label: modelo.nombreModelo, id: modelo.idModelo };
      });
      setModelos(listaModelos);
    }
  };

  const getDispositivo = async () => {
    const api = await fetch(
      `${process.env.REACT_APP_API_REST}dispositivo/listar?idMarca=${
        marcaElegida?.id ?? ""
      }&idModelo=${modeloElegido?.id ?? ""}&idBodega=${bodegaElegida?.id ?? ""}`
    );
    const data = await api.json();
    console.log(data);
    setDispositivos(data.datos);
  };

  useEffect(() => {
    getBodega();
    getMarca();
    //getDispositivo();
  }, []);

  useEffect(() => {
    getModelo();
  }, [marcaElegida]);

  return (
    <div className="App">
      <div
        style={{
          margin: "auto",
          marginTop: "3%",
          marginBottom: "3%",
          width: "65%",
        }}
      >
        <Paper
          style={{
            padding: "2%",
          }}
        >
          <Grid container columnSpacing={5}>
            <Grid xs={3} marginTop={3} marginBottom={2}>
              <Autocomplete
                disablePortal
                id="combobox-bodega"
                options={bodegas}
                value={bodegaElegida}
                onChange={(e, bodegaSeleccionada) => {
                  setBodegaElegida(bodegaSeleccionada);
                }}
                sx={{ width: 250 }}
                renderInput={(params) => (
                  <TextField {...params} label="Bodegas" />
                )}
              />
            </Grid>
            <Grid xs={3} marginTop={3} marginBottom={2}>
              <Autocomplete
                disablePortal
                id="combobox-marca"
                options={marcas}
                value={marcaElegida}
                onChange={(e, marcaSeleccionada) => {
                  setMarcaElegida(marcaSeleccionada);
                  setModeloElegido(null);
                }}
                sx={{ width: 250 }}
                renderInput={(params) => (
                  <TextField {...params} label="Marcas" />
                )}
              />
            </Grid>
            <Grid xs={3} marginTop={3} marginBottom={2}>
              <Autocomplete
                disablePortal
                id="combobox-modelo"
                options={modelos}
                value={modeloElegido}
                onChange={(e, modeloSeleccionado) => {
                  setModeloElegido(modeloSeleccionado);
                }}
                sx={{ width: 250 }}
                renderInput={(params) => (
                  <TextField {...params} label="Modelos" />
                )}
              />
            </Grid>
            <Grid xs={3} >
              <Grid container flexDirection="column">
                <Grid xs={6} margin={0.5}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => {
                      getDispositivo();
                      //llamar api q llena tabla de dispositivo
                    }}
                  >
                    FILTRAR
                  </Button>
                </Grid>
                <Grid xs={6} margin={0.5}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => {
                      setAbrir(true);
                    }}
                  >
                    AGREGAR
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <div
        style={{
          margin: "auto",
          marginTop: "3%",
          marginBottom: "3%",
          width: "65%",
        }}
      >
        <Paper
          style={{
            paddingLeft: "10%",
            paddingRight: "10%",
            paddingBottom: "3%",
            paddingTop: "1%",
          }}
        >
          <h1>Lista de Dispositivos</h1>
          <DataGrid
            disableRowSelectionOnClick
            rows={dispositivos}
            columns={columnas}
            getRowId={(row) => row.idDispositivo}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </Paper>
      </div>
      <ModalAgregar
        open={abrir}
        setAbrir={setAbrir}
        getDispositivos={getDispositivo}
        marcasModal={marcas}
        bodegasModal={bodegas}
      />
    </div>
  );
}

export default App;
