module.exports = {

    isLoggedIn(req,res,next){
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect("/refrigeracionalvarez/iniciar_sesion")
    },

    isAdmin(req,res,next){
        if (req.user.IdUsuario==15 || req.user.IdUsuario==18) {
            return next()
        }
        return res.redirect("/refrigeracionalvarez/servicios_pendientes")
    }

}