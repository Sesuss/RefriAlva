const express = require("express")
const router = express.Router()
const pool = require("../database")
const pdfc =require("../routes/pdf")
var moment = require('moment');
const {isLoggedIn, isAdmin} = require("../lib/auth")


const log = console.log

//Principal
router.get("/", isLoggedIn,  (req, res) => { 
    res.redirect("/refrigeracionalvarez/servicios_pendientes")  
})



//Agregar get

router.get("/refrigeracionalvarez/agregar_registro", isLoggedIn, async (req, res)=>{
    let cliente= await pool.query("SELECT IdCliente, Nombre, Municipio, DirCalle, DirNum from tblclientes WHERE Nombre <>' ' ORDER BY Nombre ASC")
    let num=await pool.query("SELECT max(IdCliente) as num FROM tblclientes;")
    num=num[0].num+1
    res.render("layouts/agregar_registro",{cliente, num})
})

router.get("/refrigeracionalvarez/agregar_registro:id/", isLoggedIn, async (req, res) => {
    const { id } = req.params
    const equipo = await pool.query("SELECT * FROM tblequipos WHERE IdCliente = ?", [id])
    let cliente= await pool.query("SELECT * from tblclientes WHERE IdCliente = ?",[id])
    let clientes= await pool.query("SELECT IdCliente, Nombre from tblclientes WHERE Nombre <>' ' ORDER BY Nombre ASC")
    let num=await pool.query("SELECT max(IdOrdenServicio) as num FROM tblordenservicio;")
    num=num[0].num+1
    let idcliente=cliente[0].IdCliente
    let nombre=cliente[0].Nombre
    res.render("layouts/agregar_registro_completo", { equipo, cliente, clientes, nombre, num, idcliente })
})


router.post("/agregar_registro", isLoggedIn, async (req, res) => {
    let { IdOrdenServicio, IdCliente, IdEquipo, Falla, FechaSolicitud,FechaVisita, Realizado, FechaRealizacion, FechaRecoleccion, Observaciones, ObservacionesExtra, Presupuesto, CostoServicio, Hora, IdTecnico, MedioDeInformacion } = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdOrdenServicio`,`Fecha`) VALUES (?, '6', ?,current_timestamp())",[id,IdOrdenServicio])
    if (FechaRealizacion=="") {
        FechaRealizacion=null
    }
    if (CostoServicio=="") {
        CostoServicio=null
    }
    if(	FechaRecoleccion==""){
        FechaRecoleccion=null
    }
    const newarticulo = { IdOrdenServicio, IdCliente, IdEquipo, Falla, FechaSolicitud, FechaVisita, Realizado, FechaRealizacion, FechaRecoleccion, Observaciones, ObservacionesExtra, Presupuesto, CostoServicio, Hora, IdTecnico, MedioDeInformacion }
    await pool.query("INSERT INTO tblordenservicio SET ?", [newarticulo])
    res.redirect("/refrigeracionalvarez/ver_cliente"+IdCliente+"/")

})
router.post("/por_folio", isLoggedIn, async (req, res) => {
    let {Folio} = req.body
   
    const cliente = await pool.query("SELECT * FROM `tblordenservicio` WHERE `IdOrdenServicio` = ?", [Folio])
    if (cliente[0] == undefined ) {
        res.redirect("/refrigeracionalvarez/clientes")   
    } else{
    res.redirect("/refrigeracionalvarez/ver_cliente"+cliente[0].IdCliente+"/")
    }

})

router.post("/agregar_equipo", isLoggedIn, async (req, res) => {
    let { IdCliente, IdEquipo, Categoria, Tipo, Marca, Serie, Color, Modelo } = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdCliente`, `IdEquipo`,`Fecha`) VALUES (?, '4', ?, ?, current_timestamp())",[id,IdCliente,IdEquipo])
    const newequipo = { IdCliente, IdEquipo, Categoria, Tipo, Marca, Serie, Color, Modelo }
    await pool.query("INSERT INTO tblequipos SET ?", [newequipo])
    res.redirect("/refrigeracionalvarez/agregar_registro"+IdCliente+"/")

})

router.post("/ver_cliente/agregare", isLoggedIn, async (req, res) => {
    let { IdCliente, IdEquipo, Categoria, Tipo, Marca, Serie, Color, Modelo } = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` ( `IdUsuario`, `TipoMovimiento`, `IdCliente`, `IdEquipo`, `Fecha`) VALUES (?, '4', ?, ?, current_timestamp())",[id,IdCliente,IdEquipo])
    const newequipo = { IdCliente, IdEquipo, Categoria, Tipo, Marca, Serie, Color, Modelo }
    await pool.query("INSERT INTO tblequipos SET ?", [newequipo])
    res.redirect("/refrigeracionalvarez/ver_cliente"+IdCliente+"/")

})
router.post("/editar_cliente", isLoggedIn, async (req, res) => {
    let { IdCliente, Nombre, DirColonia, DirCalle, DirNum, DirEntre, Telefono, Celular, RFC, Municipio, CP} = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdCliente`, `Fecha`) VALUES (?, '3', ?, current_timestamp())",[id,IdCliente])
    const newcliente = { IdCliente, Nombre, DirColonia, DirCalle, DirNum, DirEntre, Telefono, Celular, RFC, Municipio, CP}
    await pool.query("UPDATE tblclientes SET ? WHERE IdCliente=?", [newcliente, IdCliente])
    res.redirect("/refrigeracionalvarez/ver_cliente"+IdCliente+"/")

})

router.post("/editar_registro", isLoggedIn, async (req, res) => {
    let { IdOrdenServicio, IdCliente, IdEquipo, Falla, Garantia, FechaSolicitud, FechaVisita, FechaRecoleccion, Realizado, FechaRealizacion, Observaciones, ObservacionesExtra, Presupuesto, CostoServicio, Hora, IdTecnico, MedioDeInformacion } = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdOrdenServicio`,`Fecha`) VALUES (?, '7', ?, current_timestamp())",[id,IdOrdenServicio])
    if (IdTecnico=="JOSE MANUEL") {
        IdTecnico=1
    }else if (IdTecnico=="JUAN CARLOS") {
        IdTecnico=2
    }else if (IdTecnico=="GERARDO LOPEZ") {
        IdTecnico=3
    }else if (IdTecnico=="GERARDO LOPEZ") {
        IdTecnico=4
    }else if (IdTecnico=="MANUEL RAMIREZ") {
        IdTecnico=5
    }else if (IdTecnico=="MANUEL RICO") {
        IdTecnico=6
    }
    if (FechaRealizacion=="") {
        FechaRealizacion=null
    }
    if (CostoServicio=="") {
        CostoServicio=0
    }
    if (FechaRecoleccion=="") {
        FechaRecoleccion=0
    }
    if (Garantia=="") {
        Garantia=0
    }
    const neworden = { IdOrdenServicio, IdCliente, IdEquipo, Falla, Garantia, FechaSolicitud, FechaVisita, FechaRecoleccion, Realizado, FechaRealizacion, Observaciones, ObservacionesExtra, Presupuesto, CostoServicio, Hora, IdTecnico, MedioDeInformacion }
    await pool.query("UPDATE tblordenservicio SET ? WHERE IdOrdenServicio = ?", [neworden,IdOrdenServicio])
    res.redirect("/refrigeracionalvarez/ver_cliente"+IdCliente+"/")

})

router.post("/editar_equipo", isLoggedIn, async (req, res) => {
    let { IdCliente, IdEquipo, Categoria, Tipo, Marca, Serie, Color, Modelo} = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdCliente`, `IdEquipo`, `Fecha`) VALUES (?, '5', ?, ?, current_timestamp())",[id,IdCliente,IdEquipo])
    const newequipo = { IdCliente,IdEquipo, Categoria, Tipo, Marca, Serie, Color, Modelo}
    await pool.query("UPDATE tblequipos SET ? WHERE IdCliente=? AND IdEquipo=?", [newequipo, IdCliente, IdEquipo])
    res.redirect("/refrigeracionalvarez/ver_cliente"+IdCliente+"/")

})

router.post("/editar_garantia", isLoggedIn, async (req, res) => {
    let {IdOrdenServicio, FechaGarantiaNew, HoraGarantia, Descripcion}=req.body
    let garantia ={IdOrdenServicio, FechaGarantiaNew, HoraGarantia, Descripcion}
    await pool.query("INSERT INTO `tblgarantias` SET ?",[garantia])
    await pool.query("UPDATE tblordenservicio SET FechaGarantia = '2021-12-31 00:00:00' WHERE IdOrdenServicio = ? ", [IdOrdenServicio])
    res.redirect("/ver_garantia"+IdOrdenServicio+"/")

})
router.post("/editar_garantia_n", isLoggedIn, async (req, res) => {
    let {IdGarantia, IdOrdenServicio, FechaGarantiaNew, HoraGarantia, Descripcion}=req.body
    let garantia ={ FechaGarantiaNew, HoraGarantia, Descripcion}
    await pool.query("UPDATE tblgarantias SET ? WHERE IdGarantia = ? ", [garantia,IdGarantia])
    res.redirect("/ver_garantia"+IdOrdenServicio+"/")

})

router.get("/cerrar_garantia:id/", isLoggedIn, async (req,res) =>{
    const {id}=req.params
    await pool.query("UPDATE `tblordenservicio` SET `FechaGarantia` = null WHERE IdOrdenServicio = ?",[id])
    const cliente = await pool.query("SELECT `IdCliente` FROM `tblordenservicio` WHERE `IdOrdenServicio` = ?",[id])
    res.redirect("/refrigeracionalvarez/ver_cliente"+cliente[0].IdCliente+"/")
    })

router.post("/agregar_cliente", isLoggedIn, async (req, res) => {
    let { IdCliente, Nombre, DirColonia, DirCalle, DirNum, DirEntre, Telefono, Celular, RFC, Municipio, CP} = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdCliente`,`Fecha`) VALUES (?, '2', ?, current_timestamp())",[id,IdCliente])
    const newcliente = { IdCliente, Nombre, DirColonia, DirCalle, DirNum, DirEntre, Telefono, Celular, RFC, Municipio, CP}
    await pool.query("INSERT INTO tblclientes SET ?", [newcliente])
    
    res.redirect("/refrigeracionalvarez/agregar_registro")

})

router.post("/cliente_agregar", isLoggedIn, async (req, res) => {
    let { IdCliente, Nombre, DirColonia, DirCalle, DirNum, DirEntre, Telefono, Celular, RFC, Municipio, CP} = req.body
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdCliente`, `Fecha`) VALUES (?, '2', ?, current_timestamp())",[id,IdCliente])
    const newcliente = { IdCliente, Nombre, DirColonia, DirCalle, DirNum, DirEntre, Telefono, Celular, RFC, Municipio, CP}
    await pool.query("INSERT INTO tblclientes SET ?", [newcliente])
    res.redirect("/refrigeracionalvarez/clientes")

})


/*router.post("/agregar_garantia", isLoggedIn, async (req, res) => {
    let { IdOrdenServicio, FechaGarantia, IdCliente} = req.body
    if (FechaGarantia=="") {
        FechaGarantia=null
    }
    await pool.query("UPDATE tblordenservicio SET FechaGarantia = ? WHERE IdOrdenServicio = ?", [FechaGarantia,IdOrdenServicio])
    res.redirect("/refrigeracionalvarez/ver_cliente"+IdCliente+"/")

})*/


//Ver contenido
router.get("/refrigeracionalvarez/clientes", isLoggedIn, async (req, res) => {
    const clientes = await pool.query("SELECT * FROM tblclientes")
    let num=await pool.query("SELECT max(IdCliente) as num FROM tblclientes;")
    num=num[0].num+1
    res.render("layouts/verclientes", { clientes, num })
})


router.get("/refrigeracionalvarez/servicios_pendientes", isLoggedIn, async (req, res) => {

    let cliente = []
    let clienteg = []
    let clientep = []
    const garantia = await pool.query("SELECT * FROM `tblordenservicio` WHERE `FechaGarantia`<>'null' ORDER BY `FechaVisita` DESC")
    for (let index = 0; index < garantia.length; index++) {
        let Nclienteg = await pool.query("SELECT * FROM tblclientes WHERE `IdCliente`= ?",[garantia[index].IdCliente])
        let Gaclienteg = await pool.query("SELECT * FROM `tblgarantias` WHERE `IdOrdenServicio` = ? ",[garantia[index].IdOrdenServicio])
        clienteg.push({
            IdOrden:garantia[index].IdOrdenServicio,
            IdCliente:garantia[index].IdCliente,
            Nombre:Nclienteg[0].Nombre,
            Calle:Nclienteg[0].DirCalle,
            Localidad:Nclienteg[0].Municipio,
            FechaVisita:garantia[index].FechaVisita,
            FechaGarantiaNew:Gaclienteg[0].FechaGarantiaNew,
            Hora:Gaclienteg[0].HoraGarantia
        })
    }

    const proceso = await pool.query("SELECT * FROM `tblordenservicio` WHERE `Realizado`='100' ORDER BY `FechaVisita` DESC")
    for (let index = 0; index < proceso.length; index++) {
        let Nclienteg = await pool.query("SELECT * FROM tblclientes WHERE `IdCliente`= ?",[proceso[index].IdCliente])
        clientep.push({
            IdOrden:proceso[index].IdOrdenServicio,
            IdCliente:proceso[index].IdCliente,
            Nombre:Nclienteg[0].Nombre,
            Calle:Nclienteg[0].DirCalle,
            Localidad:Nclienteg[0].Municipio,
            FechaRealizacion:proceso[index].FechaRealizacion,
            Hora:proceso[index].Hora
        })
    }

    const pendientes = await pool.query("SELECT * FROM `tblordenservicio` WHERE realizado =0 AND `FechaVisita`<>'00000-00-00 00:00:00' ORDER BY `FechaVisita` DESC")
    for (let index = 0; index < pendientes.length; index++) {
        let Ncliente = await pool.query("SELECT * FROM tblclientes WHERE `IdCliente`= ?",[pendientes[index].IdCliente])
        cliente.push({
            IdOrden:pendientes[index].IdOrdenServicio,
            IdCliente:pendientes[index].IdCliente,
            Nombre:Ncliente[0].Nombre,
            Calle:Ncliente[0].DirCalle,
            Localidad:Ncliente[0].Municipio,
            FechaVisita:pendientes[index].FechaVisita,
            Hora:pendientes[index].Hora
        })
    }
    const horain = await pool.query("SELECT `FechaVisita`,`Presupuesto`,substring(Hora,1,5)AS HoraP FROM `tblordenservicio` WHERE realizado =0 AND`FechaVisita`<>'00000-00-00 00:00:00' ORDER BY `FechaVisita` DESC;")
    const horafi = await pool.query("SELECT `FechaVisita`,`Presupuesto`,substring(Hora,9,11)AS HoraF FROM `tblordenservicio` WHERE realizado =0 AND`FechaVisita`<>'00000-00-00 00:00:00' ORDER BY `FechaVisita` DESC;")
    for (let index = 0; index < pendientes.length; index++) {
    horaI=horain[index].HoraP
    horaF=horafi[index].HoraF
if (horaI=="01:00") {
    horain[index].HoraP="13:00"
}else if (horaI=="02:00") {
    horain[index].HoraP="14:00"
}else if (horaI=="03:00") {
    horain[index].HoraP="15:00"
}else if (horaI=="04:00") {
    horain[index].HoraP="16:00"
}else if (horaI=="05:00") {
    horain[index].HoraP="17:00"
}else if (horaI=="06:00") {
    horain[index].HoraP="18:00"
}else if (horaI=="07:00") {
    horain[index].HoraP="19:00"
}  

if (horaF=="01:00") {
    horafi[index].HoraF="13:00"
}else if (horaF=="02:00") {
    horafi[index].HoraF="14:00"
}else if (horaF=="03:00") {
    horafi[index].HoraF="15:00"
}else if (horaF=="04:00") {
    horafi[index].HoraF="16:00"
}else if (horaF=="05:00") {
    horafi[index].HoraF="17:00"
}else if (horaF=="06:00") {
    horafi[index].HoraF="18:00"
}else if (horaF=="07:00") {
    horafi[index].HoraF="19:00"
}else if (horaF=="01:30") {
    horafi[index].HoraF="13:30"
}else if (horaF=="02:30") {
    horafi[index].HoraF="14:30"
}else if (horaF=="03:30") {
    horafi[index].HoraF="15:30"
}else if (horaF=="04:30") {
    horafi[index].HoraF="16:30"
}else if (horaF=="05:30") {
    horafi[index].HoraF="17:30"
}else if (horaF=="06:30") {
    horafi[index].HoraF="18:30"
}else if (horaF=="07:30") {
    horafi[index].HoraF="19:30"
}else if (horaF=="08:00") {
    horafi[index].HoraF="20:00"
}else if (horaF=="08:30") {
    horafi[index].HoraF="20:30"
}  
//log( horain[index].HoraP+"-"+horafi[index].HoraF)
    }

    var hoy = new Date(),
    hora = hoy.getHours() + ':' + hoy.getMinutes(),
    format = 'hh:mm';
    let array = []
    for (let index = 0; index < pendientes.length; index++) {

var b=horaI=horain[index].HoraP
var c=horaF=horafi[index].HoraF

var time = moment(hora,format),
  ATime = moment(b, format),
  DTime = moment(c, format);

if (time.isBetween(ATime, DTime)) {
  //console.log('is between    '+ATime+ DTime)
  array.push({
    ahora:"si"
  })

} else {
  //console.log('is not between    '+ATime+ DTime)
  array.push({
    ahora:"no"
  })
}



    }
    res.render("layouts/servicios_pendientes", {pendientes, array, garantia, cliente, clienteg, clientep})
})


router.get("/refrigeracionalvarez/ver_cliente:id/", isLoggedIn, async (req, res) => {
    const { id } = req.params
    const equipo = await pool.query("SELECT * FROM tblequipos WHERE IdCliente = ?", [id])
    let cliente= await pool.query("SELECT * from tblclientes WHERE IdCliente = ?",[id])
    const orden = await pool.query("SELECT * FROM tblordenservicio WHERE IdCliente = ? ORDER BY IdOrdenServicio DESC",[id])
    for (let index = 0; index < orden.length; index++) {
        if (orden[index].Realizado==0) {
            orden[index].Realizado="No"
        }else if (orden[index].Realizado==100) {
            orden[index].Realizado="En Taller"
        }else if (orden[index].Realizado==128) {
            orden[index].Realizado="Cotizacion"
        }else{
            orden[index].Realizado="Si"
        }
    }
    for (let index = 0; index < orden.length; index++) {

        if (orden[index].IdTecnico==1) {
            orden[index].IdTecnico="JOSE MANUEL"
        }else if (orden[index].IdTecnico==2) {
            orden[index].IdTecnico="JUAN CARLOS"
        }else if (orden[index].IdTecnico==3) {
            orden[index].IdTecnico="GERARDO LOPEZ"
        }else if(orden[index].IdTecnico==4){
            orden[index].IdTecnico="SEBASTIAN BLANCO"
        }else if (orden[index].IdTecnico==5) {
            orden[index].IdTecnico="MANUEL RAMIREZ"
        }else if (orden[index].IdTecnico==6) {
            orden[index].IdTecnico="MANUEL RICO"
        }
    }

    res.render("layouts/cliente_completo", { equipo, cliente, orden ,id })
})

router.get("/editar_garantia_n:id", isLoggedIn, async (req, res) => {
    const { id } = req.params
    const orden = await pool.query("SELECT * FROM `tblgarantias` WHERE `IdGarantia` = ? ",[id])
    res.render("layouts/editar_garantia", {orden ,id })
})



router.get("/refrigeracionalvarez/reportes", isLoggedIn, isAdmin, async (req, res) => {
        res.render("layouts/reporte")
    
})
router.get("/nadaaaa", isLoggedIn, async (req, res) => {

    res.render("layouts/firmaa")

})


router.post("/refrigeracionalvarez/ver_movimientos", isLoggedIn, isAdmin, async (req, res) => {
    let {desde, hasta} =req.body
    desde=desde+" 00:00:00"
    hasta=hasta+" 23:59:59"
        let movimiento = await pool.query("SELECT * FROM `tblmovimientos` WHERE DATE(`Fecha`)>= ?  AND DATE(`Fecha`)<= ?  AND IdUsuario <> '15';", [desde,hasta])
        log(movimiento)
        for (let index = 0; index < movimiento.length; index++) {
            


            if (movimiento[index].IdUsuario==21) {
                movimiento[index].IdUsuario="Juan Carlos Alvarez"

            } else if (movimiento[index].IdUsuario==22) {
                movimiento[index].IdUsuario="Itzel Alvarez Contreras"

            }else if (movimiento[index].IdUsuario==18) {
                movimiento[index].IdUsuario="Jose Manuel Alvarez"

            }else if (movimiento[index].IdUsuario==23) {
                movimiento[index].IdUsuario="Ofelia Ch??vez Benavides"
            }

            if (movimiento[index].TipoMovimiento==0) {
                movimiento[index].TipoMovimiento="Inicio de sesion"
            } else if (movimiento[index].TipoMovimiento==1) {
                movimiento[index].TipoMovimiento="Cerro sesion"
            } else if (movimiento[index].TipoMovimiento==2) {
                movimiento[index].TipoMovimiento="Agrego usuario"
            } else if (movimiento[index].TipoMovimiento==3) {
                movimiento[index].TipoMovimiento="Edito usuario"
            } else if (movimiento[index].TipoMovimiento==4) {
                movimiento[index].TipoMovimiento="Agrego equipo"
            } else if (movimiento[index].TipoMovimiento==5) {
                movimiento[index].TipoMovimiento="Edito usuario"
            } else if (movimiento[index].TipoMovimiento==6) {
                movimiento[index].TipoMovimiento="Agrego orden"
            } else if (movimiento[index].TipoMovimiento==7) {
                movimiento[index].TipoMovimiento="Edito orden"
            } else if (movimiento[index].TipoMovimiento==8) {
                movimiento[index].TipoMovimiento="Creo PDF"
            } else if (movimiento[index].TipoMovimiento==9) {
                movimiento[index].TipoMovimiento="Creo IMG"
            } else if (movimiento[index].TipoMovimiento==10) {
                movimiento[index].TipoMovimiento="Agrego nota"
            } else if (movimiento[index].TipoMovimiento==11) {
                movimiento[index].TipoMovimiento="Cerro nota"
            }
        
            if (movimiento[index].IdOrdenServicio==0) {
                movimiento[index].IdOrdenServicio=""
            }
            if (movimiento[index].IdCliente==0) {
                movimiento[index].IdCliente=""
            }
            if (movimiento[index].IdEquipo==0) {
                movimiento[index].IdEquipo=""
            }

            
        }
        log(movimiento)
        res.render("layouts/reporte_movimiento",{movimiento})
    
})

router.post("/refrigeracionalvarez/ver_reporte", isLoggedIn, isAdmin, async (req, res) => {
    let {desde, hasta} =req.body
     let ordenes = await pool.query("SELECT substring(FechaRealizacion,1,10)AS fecha, CostoServicio, IdTecnico FROM tblordenservicio WHERE Realizado = 255")
     let tec1=0,
     tec2=0,
     tec3=0,
     tec4=0,
     tec5=0,
     tec6=0,
     tec1n=0,
     tec2n=0,
     tec3n=0,
     tec4n=0,
     tec5n=0,
     tec6n=0,
     a=0,
     total=0,
     format="yyyy-MM-DD"
     for (let index = 0; index < ordenes.length; index++) {


        var fecha = moment(ordenes[index].fecha,format),
        ATime = moment(desde, format),
        DTime = moment(hasta, format);

        if (fecha.isBetween(ATime, DTime)) {
        a=a+1
        total+=ordenes[index].CostoServicio
        if (ordenes[index].IdTecnico==1) {
            tec1n+=+1
            tec1+=ordenes[index].CostoServicio
        } else if (ordenes[index].IdTecnico==2) {
            tec2n+=+1
            tec2+=ordenes[index].CostoServicio
        }else if (ordenes[index].IdTecnico==3) {
            tec3n+=+1
            tec3+=ordenes[index].CostoServicio
        }else if (ordenes[index].IdTecnico==4) {
            tec4n+=+1
            tec4+=ordenes[index].CostoServicio
        }else if (ordenes[index].IdTecnico==5) {
            tec5n+=+1
            tec5+=ordenes[index].CostoServicio
        }else if (ordenes[index].IdTecnico==6) {
            tec6n+=+1
            tec6+=ordenes[index].CostoServicio
        }

        }
        }
        total = Intl.NumberFormat('en-EU', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(total);
        tec1 = Intl.NumberFormat('en-EU', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(tec1);
        tec2 = Intl.NumberFormat('en-EU', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(tec2);
        tec3 = Intl.NumberFormat('en-EU', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(tec3);
        tec4 = Intl.NumberFormat('en-EU', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(tec4);
        tec5 = Intl.NumberFormat('en-EU', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(tec5);
        tec6 = Intl.NumberFormat('en-EU', {style: 'currency',currency: 'MXN', minimumFractionDigits: 2}).format(tec6);
    res.render("layouts/reporte_tecnico",{total,tec1,tec2,tec3,tec4,tec5,tec6,tec1n,tec2n,tec3n,tec4n,tec5n,tec6n})
})



router.post("/refrigeracionalvarez/reporte_medio", isLoggedIn, isAdmin, async (req, res) => {
     let {desde, hasta} =req.body
     let ordenes = await pool.query("SELECT substring(FechaRealizacion,1,10)AS fecha, MedioDeInformacion FROM tblordenservicio WHERE Realizado = 255")
     let medios = {Revista:0,Cliente:0,Recomendacion:0,Tarjeta:0,Volante:0,Facebook:0}
     format="yyyy-MM-DD"
     for (let index = 0; index < ordenes.length; index++) {


        var fecha = moment(ordenes[index].fecha,format),
        ATime = moment(desde, format),
        DTime = moment(hasta, format);

        if (fecha.isBetween(ATime, DTime)) {
            if (ordenes[index].MedioDeInformacion=="anuncio") {
                medios.Revista++  
            }else if (ordenes[index].MedioDeInformacion=="cliente") {
                medios.Cliente++
            }else if (ordenes[index].MedioDeInformacion=="recomendacion") {
                medios.Recomendacion++
            }else if (ordenes[index].MedioDeInformacion=="tarjeta") {
                medios.Tarjeta++
            }else if (ordenes[index].MedioDeInformacion=="volante") {
                medios.Volante++
            }else if (ordenes[index].MedioDeInformacion=="facebook") {
                medios.Facebook++
            }
            

        }
        }
        let total = medios.Tarjeta+medios.Recomendacion+medios.Cliente+medios.Revista
    res.render("layouts/reporte_medio",{medios,total})
})


router.post("/refrigeracionalvarez/reporte_localidad", isLoggedIn, isAdmin, async (req, res) => {
    /* let {desde, hasta} =req.body 
     let info = await pool.query("SELECT `Municipio`, COUNT(1) AS total FROM tblclientes WHERE DATE(`Fecha`)>= ?  AND DATE(`Fecha`)<= ? GROUP BY `Municipio` HAVING COUNT(1) > 1",[desde,hasta])*/
     let info = await pool.query("SELECT `Municipio`, COUNT(1) AS total FROM tblclientes GROUP BY `Municipio` HAVING COUNT(1) > 1;")
    
    res.render("layouts/reporte_localidad",{info})
})


//PDF-Notas
router.get("/descargar",  pdfc.desimg)

router.get("/ver",  pdfc.img)





router.get("/pdf",  pdfc.despdf)

router.get("/verpdf",  pdfc.pdf)




router.get("/ver_nota/:id", isLoggedIn, async (req,res) =>{
const {id}=req.params
let idu = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdOrdenServicio`,`Fecha`) VALUES (?, '9', ?, current_timestamp())",[idu,id])
await pool.query("UPDATE tblidnotas SET IdOrden = ? WHERE IdNota = 1",[id])
res.redirect("/descargar")
})

router.get("/ver_garantia:id/", isLoggedIn, async (req,res) =>{
    const {id}=req.params
    const orden = await pool.query("SELECT * FROM tblgarantias WHERE IdOrdenServicio = ?",[id])
    let cliente = await pool.query("SELECT `IdCliente` FROM `tblordenservicio` WHERE `IdOrdenServicio`=?",[id])
    const garantia = await pool.query("SELECT * FROM `tblgarantias` WHERE `IdOrdenServicio` = ? ORDER BY `IdGarantia` DESC",[id])

    cliente=cliente[0].IdCliente

        res.render("layouts/garantia",{orden, id, cliente, garantia})
    })

router.get("/ver_pdf:id/", isLoggedIn, async (req,res) =>{
const {id}=req.params
let idu = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `IdOrdenServicio`, `Fecha`) VALUES (?, '8', ?, current_timestamp())",[idu,id])
await pool.query("UPDATE tblidnotas SET IdOrden = ? WHERE IdNota = 1",[id])
res.redirect("/pdf")
})














/*



router.get("/aa", isLoggedIn, async (req,res) =>{
    const fecha=await pool.query("SELECT * FROM tblordenservicio")
    for (let index = 0; index < fecha.length ; index++) {
        await pool.query("UPDATE tblordenservicio SET FechaVisita = ? WHERE IdOrdenServicio = ?",[fecha[index].FechaRealizacion,fecha[index].IdOrdenServicio])

    }
   
    res.send("Listoooo")
    })


    
router.get("/bb", isLoggedIn, async (req,res) =>{
        await pool.query("UPDATE tblordenservicio SET FechaGarantia = 'null' WHERE FechaGarantia <> 'null'")
    res.send("Listoooo")
    })




    router.get("/mayus", isLoggedIn, async (req,res) =>{
        const datos=await pool.query("SELECT * FROM tblordenservicio")

        for (let index = 0; index < datos.length ; index++) {
            datos[index].Falla=datos[index].Falla.toUpperCase()
            await pool.query("UPDATE tblordenservicio SET Falla = ? WHERE IdOrdenServicio = ?",[datos[index].Falla,datos[index].IdOrdenServicio])
            if (datos[index].Observaciones==null) {
                
            }else{
            datos[index].Observaciones=datos[index].Observaciones.toUpperCase()
            await pool.query("UPDATE tblordenservicio SET Observaciones = ? WHERE IdOrdenServicio = ?",[datos[index].Observaciones,datos[index].IdOrdenServicio])}

        }
   
    res.send("Listoooo")
    })


    router.get("/mayust", isLoggedIn, async (req,res) =>{
        const datos=await pool.query("SELECT * FROM tbltecnicos")

        for (let index = 0; index < datos.length ; index++) {
            if (datos[index].Direccion==null) {
                
            }else{
            datos[index].Direccion=datos[index].Direccion.toUpperCase()
            await pool.query("UPDATE tbltecnicos SET Direccion = ? WHERE IdTecnico = ?",[datos[index].Direccion,datos[index].IdTecnico])}
            

        }
   
    res.send("Listoooo")
    })

    router.get("/mayuse", isLoggedIn, async (req,res) =>{
        const datos=await pool.query("SELECT * FROM tblequipos")
        for (let index = 0; index < datos.length ; index++) {
            if (datos[index].Marca==null) {
                
            }else{
            datos[index].Marca=datos[index].Marca.toUpperCase()
            await pool.query("UPDATE tblequipos SET Marca = ? WHERE IdCliente = ? AND IdEquipo = ?",[datos[index].Marca,datos[index].IdCliente,datos[index].IdEquipo])}
            

            if (datos[index].Color==null) {
                
            }else{
            datos[index].Color=datos[index].Color.toUpperCase()
            await pool.query("UPDATE tblequipos SET Color = ? WHERE IdCliente = ? AND IdEquipo = ?",[datos[index].Color,datos[index].IdCliente,datos[index].IdEquipo])}


            if (datos[index].Modelo==null) {
                
            }else{
            datos[index].Modelo=datos[index].Modelo.toUpperCase()
            await pool.query("UPDATE tblequipos SET Modelo = ? WHERE IdCliente = ? AND IdEquipo = ?",[datos[index].Modelo,datos[index].IdCliente,datos[index].IdEquipo])}

        }
   
    res.send("Listoooo")
    })



    router.get("/mayusc", isLoggedIn, async (req,res) =>{
        const datos=await pool.query("SELECT * FROM tblclientes")

        for (let index = 0; index < datos.length ; index++) {
            if (datos[index].Nombre==null) {
                
            }else{
            datos[index].Nombre=datos[index].Nombre.toUpperCase()
            await pool.query("UPDATE tblclientes SET Nombre = ? WHERE IdCliente = ?",[datos[index].Nombre,datos[index].IdCliente])}

            if (datos[index].DirColonia==null) {
                
            }else{
            datos[index].DirColonia=datos[index].DirColonia.toUpperCase()
            await pool.query("UPDATE tblclientes SET DirColonia = ? WHERE IdCliente = ?",[datos[index].DirColonia,datos[index].IdCliente])}

            if (datos[index].DirCalle==null) {
                
            }else{
            datos[index].DirCalle=datos[index].DirCalle.toUpperCase()
            await pool.query("UPDATE tblclientes SET DirCalle = ? WHERE IdCliente = ?",[datos[index].DirCalle,datos[index].IdCliente])}

            if (datos[index].DirEntre==null) {
                
            }else{
            datos[index].DirEntre=datos[index].DirEntre.toUpperCase()
            await pool.query("UPDATE tblclientes SET DirEntre = ? WHERE IdCliente = ?",[datos[index].DirEntre,datos[index].IdCliente])}

            if (datos[index].Municipio==null) {
                
            }else{
            datos[index].Municipio=datos[index].Municipio.toUpperCase()
            await pool.query("UPDATE tblclientes SET Municipio = ? WHERE IdCliente = ?",[datos[index].Municipio,datos[index].IdCliente])}

            if (datos[index].RFC==null) {
                
            }else{
            datos[index].RFC=datos[index].RFC.toUpperCase()
            await pool.query("UPDATE tblclientes SET RFC = ? WHERE IdCliente = ?",[datos[index].RFC,datos[index].IdCliente])}
            

        }
   
    res.send("Listoooo")
    })



    router.get("/mayuscn", isLoggedIn, async (req,res) =>{
        const datos=await pool.query("SELECT * FROM tblclientes")

        for (let index = 0; index < datos.length ; index++) {
            if (datos[index].DirNum==null) {
                
            }else{
            datos[index].DirNum=datos[index].DirNum.toUpperCase()
            await pool.query("UPDATE tblclientes SET DirNum = ? WHERE IdCliente = ?",[datos[index].DirNum,datos[index].IdCliente])}
            

        }
        res.send("Listoooo")
    })

    router.get("/notacerrada", isLoggedIn, async (req,res) =>{
        
            await pool.query("UPDATE tblnotas SET NotaCerrada = '1' WHERE NotaCerrada = '0'")
        
        res.send("Listoooo")
    })

    router.get("/cant", isLoggedIn, async (req,res) =>{
       await pool.query("UPDATE tbldetallenota SET Cantidad = 1 WHERE Cantidad = 0")
        res.send("Listoooo")
    })



    */
//Exportar
module.exports = router