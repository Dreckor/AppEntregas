import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

function ProtectedRouteAdmin() {
  const { isAuthenticated, loading, user } =useAuth()
  if(loading) return <h1>cargando</h1>
  if(!isAuthenticated || !user.role == 'admin') return <Navigate to='/login' replace/>
  return (
    <Outlet/>
  )
}

function ProtectedRouteRepartidor() {
  const { isAuthenticated, loading, user } =useAuth()
  if(loading) return <h1>cargando</h1>
  if(!isAuthenticated || !user.role == 'repartidor') return <Navigate to='/login' replace/>
  return (
    <Outlet/>
  )
}

function ProtectedRouteUser() {
  const { isAuthenticated, loading, user } =useAuth()
  if(loading) return <h1>cargando</h1>
  if(!isAuthenticated || !user.role == 'user') return <Navigate to='/login' replace/>
  return (
    <Outlet/>
  )
}


export {ProtectedRouteAdmin,ProtectedRouteRepartidor,ProtectedRouteUser}