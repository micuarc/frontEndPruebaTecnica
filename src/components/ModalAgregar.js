import styled from "@emotion/styled";
import {
  Autocomplete,
  Button,
  Grid,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

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

function ModalAgregar({
  open,
  setAbrir,
  marcasModal,
  bodegasModal,
  getDispositivos,
}) {
  const [bodegaModal, setBodegaModal] = useState(null);
  const [marcaModal, setMarcaModal] = useState(null);
  const [modeloModal, setModeloModal] = useState(null);
  const [modelos, setModelos] = useState([]);
  const [dispositivoModal, setDispositivoModal] = useState("");

  const getModelo = async (marcaSeleccionada) => {
    if (marcaSeleccionada != null) {
      const api = await fetch(
        `${process.env.REACT_APP_API_REST}modelo/listar?idMarca=${marcaSeleccionada.id}`
      );
      const data = await api.json();
      const listaModelos = data.datos.map((modelo) => {
        return { label: modelo.nombreModelo, id: modelo.idModelo };
      });
      setModelos(listaModelos);
    }
  };
  const guardarDispositivo = async () => {
    if (dispositivoModal != null) {
      const api = await fetch(
        `${process.env.REACT_APP_API_REST}dispositivo/agregar`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idModelo: modeloModal?.id,
            idBodega: bodegaModal?.id,
            nombreDispositivo: dispositivoModal,
          }),
        }
      );
      getDispositivos();
      setAbrir(false);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setBodegaModal(null);
          setMarcaModal(null);
          setModeloModal(null);
          setDispositivoModal("");
          setAbrir(false);
        }}
      >
        <Paper sx={style}>
          <center>
            <h2>Agregar dispositivo</h2>
          </center>
          <Grid container flexDirection="column">
            <Grid xs={3} paddingBottom={1}>
              <Autocomplete
                disablePortal
                id="combobox-bodega-modal"
                options={bodegasModal}
                value={bodegaModal}
                onChange={(e, bodegaSeleccionada) => {
                  setBodegaModal(bodegaSeleccionada);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Bodegas" />
                )}
              />
            </Grid>
            <Grid xs={3} paddingBottom={1}>
              <Autocomplete
                disablePortal
                id="combobox-marca-modal"
                options={marcasModal}
                value={marcaModal}
                onChange={(e, marcaSeleccionada) => {
                  setMarcaModal(marcaSeleccionada);
                  getModelo(marcaSeleccionada);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Marcas" />
                )}
              />
            </Grid>
            <Grid xs={3} paddingBottom={1}>
              <Autocomplete
                disablePortal
                id="combobox-modelo-modal"
                options={modelos}
                value={modeloModal}
                onChange={(e, modeloSeleccionado) => {
                  setModeloModal(modeloSeleccionado);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Modelos" />
                )}
              />
            </Grid>
            <Grid xs={3} paddingBottom={1}>
              <TextField
                id="nombre-dispositivo-input"
                label="Nombre Dispositivo"
                value={dispositivoModal}
                sx={{ width: 300 }}
                onChange={(e) => {
                  setDispositivoModal(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <div
            style={{
              position: "relative",
              top: "3%",
              left: "30%",
              right: "30%",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => {
                guardarDispositivo();
              }}
            >
              AGREGAR
            </Button>
          </div>
        </Paper>
      </Modal>
    </div>
  );
}

export default ModalAgregar;
