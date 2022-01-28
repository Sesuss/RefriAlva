const express = require("express")
const router = express.Router()
const passport = require("passport")
const pool = require("../database")
const {isLoggedIn} = require("../lib/auth")
/*
router.get("/refrigeracionalvarez/registro",  (req,res) =>{
    res.render("auth/registro",{layout:"main_auth"})
})

router.post("/registro",  passport.authenticate("local.signup",{
        successRedirect: "/refrigeracionalvarez/servicios_pendientes",
        failureRedirect: "/refrigeracionalvarez/registro"
    
}))
*/


router.get("/refrigeracionalvarez/iniciar_sesion", (req,res) =>{
    res.render("auth/inicio",{layout:"main_auth"})
})


router.post("/iniciar_sesion", passport.authenticate("local.signin",{
    successRedirect: "/refrigeracionalvarez/servicios_pendientes",
    failureRedirect: "/refrigeracionalvarez/iniciar_sesion"

}))


router.get("/refrigeracionalvarez/salir", isLoggedIn, async (req,res) =>{
    let id = req.user.IdUsuario
    await pool.query("INSERT INTO `tblmovimientos` (`IdUsuario`, `TipoMovimiento`, `Fecha`) VALUES (?, '1',current_timestamp())",[id])
    req.logOut()
    res.redirect("/refrigeracionalvarez/iniciar_sesion")
})

module.exports= router