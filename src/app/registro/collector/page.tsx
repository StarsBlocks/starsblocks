'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import spainLocations from '@/data/spain-locations.json'
import CustomSelect from '@/components/CustomSelect'
import { AuthNav } from '@/components/AuthNav'

export default function RegistroCollectorPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedComunidad, setSelectedComunidad] = useState('')
  const [selectedProvincia, setSelectedProvincia] = useState('')
  const [selectedMunicipio, setSelectedMunicipio] = useState('')

  // Opciones para los selects
  const comunidadOptions = spainLocations.comunidades.map(c => ({
    value: c.nombre,
    label: c.nombre
  }))

  const comunidad = spainLocations.comunidades.find(c => c.nombre === selectedComunidad)
  const provinciaOptions = comunidad?.provincias.map(p => ({ value: p.nombre, label: p.nombre })) || []

  const provincia = comunidad?.provincias.find(p => p.nombre === selectedProvincia)
  const municipioOptions = provincia?.municipios.map(m => ({ value: m, label: m })) || []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      dni: formData.get('dni'),
      company: formData.get('company'),
      zone: formData.get('zone'),
      vehicle: formData.get('vehicle'),
      license: formData.get('license'),
      community: formData.get('community'),
      province: formData.get('province'),
      council: formData.get('council'),
    }

    const res = await fetch('/api/collectors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setLoading(false)

    if (!res.ok) {
      const error = await res.json()
      setError(error.error || 'Error al registrar')
      return
    }

    router.push('/login?registered=true')
  }

  return (
    <>
      <AuthNav current="register" />
      <main className="auth-shell">
        <div className="auth-panel auth-panel--wide">
          <div className="auth-heading">
            <h1>Registro Recolector</h1>
            <p id="collector-register-description">Únete como recolector y registra transacciones de reciclaje</p>
          </div>

        {error && (
          <p className="auth-error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit} aria-describedby="collector-register-description">
          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">
                Nombre completo
              </label>
              <input
                className="auth-input"
                type="text"
                id="name"
                name="name"
                required
                placeholder="Juan Pérez"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="dni">
                DNI
              </label>
              <input
                className="auth-input"
                type="text"
                id="dni"
                name="dni"
                required
                placeholder="12345678A"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              className="auth-input"
              type="email"
              id="email"
              name="email"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="community">
              Comunidad Autónoma
            </label>
            <CustomSelect
              id="community"
              name="community"
              value={selectedComunidad}
              onChange={(val) => {
                setSelectedComunidad(val)
                setSelectedProvincia('')
                setSelectedMunicipio('')
              }}
              options={comunidadOptions}
              placeholder="Seleccionar comunidad..."
              required
            />
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="province">
                Provincia
              </label>
              <CustomSelect
                id="province"
                name="province"
                value={selectedProvincia}
                onChange={(val) => {
                  setSelectedProvincia(val)
                  setSelectedMunicipio('')
                }}
                options={provinciaOptions}
                placeholder="Seleccionar provincia..."
                disabled={!selectedComunidad}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="council">
                Municipio
              </label>
              <CustomSelect
                id="council"
                name="council"
                value={selectedMunicipio}
                onChange={setSelectedMunicipio}
                options={municipioOptions}
                placeholder="Seleccionar municipio..."
                disabled={!selectedProvincia}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="company">
              Empresa
            </label>
            <input
              className="auth-input"
              type="text"
              id="company"
              name="company"
              required
              placeholder="Nombre de la empresa"
            />
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label className="auth-label" htmlFor="zone">
                Zona de recolección
              </label>
              <input
                className="auth-input"
                type="text"
                id="zone"
                name="zone"
                required
                placeholder="Zona Norte"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="vehicle">
                Vehículo (placa)
              </label>
              <input
                className="auth-input"
                type="text"
                id="vehicle"
                name="vehicle"
                placeholder="ABC-123"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="license">
              Licencia/Permisos
            </label>
            <input
              className="auth-input"
              type="text"
              id="license"
              name="license"
              placeholder="Número de licencia"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Contraseña
            </label>
            <input
              className="auth-input"
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme como Recolector'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </p>
        <p className="auth-link">
          ¿Eres usuario? <Link href="/registro">Regístrate como usuario</Link>
        </p>
      </div>
    </main>
    </>
  )
}
