import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsApi } from '../services/studentsApi';
import type { StudentOnboardingData, CareerTrack, ExperienceLevel, YearsOfExperience, LearningStyle, FeedbackTiming, ProjectExperience, TeamExperience, TimeHorizon, FocusArea } from '../types/student';
import { MessageAlert } from '../components/ui/MessageAlert';

// Import icons from lucide-react
import { ArrowRight, ArrowLeft, Check, Rocket, Code, Target, Loader2 } from 'lucide-react';

import { useAuthContext } from '../contexts/AuthContext';

const Onboarding: React.FC = () => {
	const navigate = useNavigate();
	const { token, markOnboardingComplete } = useAuthContext();
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const totalSteps = 3;

	// Form state
	const [formData, setFormData] = useState<StudentOnboardingData>({
		career_track: '' as CareerTrack,
		experience_level: '' as ExperienceLevel,
		years_of_experience: '' as YearsOfExperience,
		learning_style: '' as LearningStyle,
		feedback_timing: '' as FeedbackTiming,
		project_experience: '' as ProjectExperience,
		team_experience: '' as TeamExperience,
		has_production_experience: false,
		desired_technologies: [],
		strength_areas: [],
		improvement_areas: [],
		focus_areas: [],
		time_horizon: '' as TimeHorizon,
		experience_notes: ''
	});

	const [techInput, setTechInput] = useState('');
	const [strengthInput, setStrengthInput] = useState('');
	const [improvementInput, setImprovementInput] = useState('');

	const handleNext = () => {
		if (currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
			setError(null);
		} else {
			handleSubmit();
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
			setError(null);
		}
	};

	const handleSubmit = async () => {
		if (!token) {
			setError('Authentication required');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await studentsApi.completeOnboarding(formData, token);
			markOnboardingComplete();
			navigate('/dashboard');
		} catch (err: any) {
			setError(err.message || 'Error completing onboarding. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const addTag = (field: 'desired_technologies' | 'strength_areas' | 'improvement_areas', value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
		if (value.trim() && formData[field].length < 20) {
			setFormData(prev => ({
				...prev,
				[field]: [...prev[field], value.trim()]
			}));
			setter('');
		}
	};

	const removeTag = (field: 'desired_technologies' | 'strength_areas' | 'improvement_areas', index: number) => {
		setFormData(prev => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index)
		}));
	};

	const toggleFocusArea = (area: FocusArea) => {
		setFormData(prev => {
			const currentAreas = prev.focus_areas;
			if (currentAreas.includes(area)) {
				return { ...prev, focus_areas: currentAreas.filter(a => a !== area) };
			} else if (currentAreas.length < 5) {
				return { ...prev, focus_areas: [...currentAreas, area] };
			}
			return prev;
		});
	};

	const isStepValid = (step: number): boolean => {
		switch (step) {
			case 1:
				return !!formData.career_track && !!formData.experience_level && !!formData.years_of_experience;
			case 2:
				return !!formData.learning_style && !!formData.feedback_timing;
			case 3:
				return !!formData.project_experience && !!formData.team_experience && !!formData.time_horizon;
			default:
				return false;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-4xl">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-[#2E2E2E] font-montserrat mb-2">
						Bienvenido a Miniworker Academy!
					</h1>
					<p className="text-gray-600 text-lg">
						Personaliza tu viaje de aprendizaje
					</p>
				</div>

				{/* Progress bar */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
						{[1, 2, 3].map(step => (
							<div key={step} className="flex items-center flex-1">
								<div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step < currentStep ? 'bg-green-500 text-white' :
									step === currentStep ? 'bg-[#1E90FF] text-white ring-4 ring-blue-200' :
										'bg-gray-200 text-gray-500'
									}`}>
									{step < currentStep ? <Check className="w-5 h-5" /> : step}
								</div>
								{step < 3 && (
									<div className={`flex-1 h-1 mx-2 rounded-full transition-all ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'
										}`} />
								)}
							</div>
						))}
					</div>
					<div className="flex justify-between text-xs text-gray-500 mt-2">
						<span>Objetivos de carrera</span>
						<span>Estilo de aprendizaje</span>
						<span>Experiencia</span>
					</div>
				</div>

				{/* Main card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 min-h-[500px] flex flex-col">
					{error && <MessageAlert type="error" message={error} />}

					{/* Step 1: Career & Experience */}
					{currentStep === 1 && (
						<div className="flex-1 space-y-6 animate-fade-in">
							<div className="text-center mb-6">
								<div className="inline-block p-3 bg-purple-100 rounded-full mb-3">
									<Target className="w-8 h-8 text-purple-600" />
								</div>
								<h2 className="text-2xl font-bold text-[#2E2E2E] font-montserrat">
									Objetivos de carrera & Experiencia
								</h2>
								<p className="text-gray-600 mt-2">Ayúdanos a entender dónde quieres llegar</p>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
									¿Cuál es tu objetivo de carrera? *
								</label>
								<div className="grid grid-cols-2 gap-3">
									{[
										{ value: 'backend', label: 'Backend', icon: '🖥️' },
										{ value: 'frontend', label: 'Frontend', icon: '🎨' },
										{ value: 'fullstack', label: 'Full Stack', icon: '🚀' },
										{ value: 'mobile', label: 'Mobile', icon: '📱' },
										{ value: 'devops', label: 'DevOps', icon: '⚙️' },
										{ value: 'qa', label: 'QA/Testing', icon: '🧪' },
										{ value: 'data_engineer', label: 'Data Engineer', icon: '📊' },
										{ value: 'product_manager', label: 'Product Manager', icon: '📈' }
									].map(option => (
										<button
											key={option.value}
											type="button"
											onClick={() => setFormData(prev => ({ ...prev, career_track: option.value as CareerTrack }))}
											className={`p-4 border-2 rounded-lg text-left transition-all hover:scale-105 ${formData.career_track === option.value
												? 'border-[#1E90FF] bg-blue-50 shadow-md'
												: 'border-gray-200 hover:border-blue-300'
												}`}
										>
											<div className="text-2xl mb-1">{option.icon}</div>
											<div className="font-medium text-[#2E2E2E]">{option.label}</div>
										</button>
									))}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
										Experience Level *
									</label>
									<div className="space-y-2">
										{[
											{ value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
											{ value: 'junior', label: 'Junior', desc: '0-2 years' },
											{ value: 'mid_level', label: 'Mid-Level', desc: '2-5 years' },
											{ value: 'senior', label: 'Senior', desc: '5+ years' }
										].map(option => (
											<button
												key={option.value}
												type="button"
												onClick={() => setFormData(prev => ({ ...prev, experience_level: option.value as ExperienceLevel }))}
												className={`w-full p-3 border-2 rounded-lg text-left transition-all ${formData.experience_level === option.value
													? 'border-[#1E90FF] bg-blue-50'
													: 'border-gray-200 hover:border-blue-300'
													}`}
											>
												<div className="font-medium text-[#2E2E2E]">{option.label}</div>
												<div className="text-xs text-gray-500">{option.desc}</div>
											</button>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
										Years of Professional Experience *
									</label>
									<select
										value={formData.years_of_experience}
										onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: e.target.value as YearsOfExperience }))}
										className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
									>
										<option value="">Select...</option>
										<option value="0">No experience yet</option>
										<option value="0-1">Less than 1 year</option>
										<option value="1-3">1-3 years</option>
										<option value="3-5">3-5 years</option>
										<option value="5+">5+ years</option>
									</select>
								</div>
							</div>
						</div>
					)}

					{/* Step 2: Learning Style */}
					{currentStep === 2 && (
						<div className="flex-1 space-y-6 animate-fade-in">
							<div className="text-center mb-6">
								<div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
									<Code className="w-8 h-8 text-blue-600" />
								</div>
								<h2 className="text-2xl font-bold text-[#2E2E2E] font-montserrat">
									¿Cómo aprendes mejor?
								</h2>
								<p className="text-gray-600 mt-2">Adaptaremos los desafíos para que coincidan con tus preferencias</p>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
									Estilo de aprendizaje *
								</label>
								<div className="grid grid-cols-2 gap-4">
									<button
										type="button"
										onClick={() => setFormData(prev => ({ ...prev, learning_style: 'structured' as LearningStyle }))}
										className={`p-6 border-2 rounded-xl text-center transition-all hover:scale-105 ${formData.learning_style === 'structured'
											? 'border-[#1E90FF] bg-blue-50 shadow-lg'
											: 'border-gray-200 hover:border-blue-300'
											}`}
									>
										<div className="text-4xl mb-3">📚</div>
										<div className="font-bold text-[#2E2E2E] mb-2">Estructurado</div>
										<div className="text-sm text-gray-600">Guía paso a paso con instrucciones claras</div>
									</button>
									<button
										type="button"
										onClick={() => setFormData(prev => ({ ...prev, learning_style: 'open_ended' as LearningStyle }))}
										className={`p-6 border-2 rounded-xl text-center transition-all hover:scale-105 ${formData.learning_style === 'open_ended'
											? 'border-[#1E90FF] bg-blue-50 shadow-lg'
											: 'border-gray-200 hover:border-blue-300'
											}`}
									>
										<div className="text-4xl mb-3">🎯</div>
										<div className="font-bold text-[#2E2E2E] mb-2">Abierto</div>
										<div className="text-sm text-gray-600">Explora y descubre por ti mismo</div>
									</button>
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
									¿Cuándo quieres feedback? *
								</label>
								<div className="grid grid-cols-2 gap-4">
									<button
										type="button"
										onClick={() => setFormData(prev => ({ ...prev, feedback_timing: 'immediate' as FeedbackTiming }))}
										className={`p-6 border-2 rounded-xl text-center transition-all hover:scale-105 ${formData.feedback_timing === 'immediate'
											? 'border-[#1E90FF] bg-blue-50 shadow-lg'
											: 'border-gray-200 hover:border-blue-300'
											}`}
									>
										<div className="text-4xl mb-3">⚡</div>
										<div className="font-bold text-[#2E2E2E] mb-2">Inmediato</div>
										<div className="text-sm text-gray-600">Recibe feedback inmediatamente después de cada paso</div>
									</button>
									<button
										type="button"
										onClick={() => setFormData(prev => ({ ...prev, feedback_timing: 'final' as FeedbackTiming }))}
										className={`p-6 border-2 rounded-xl text-center transition-all hover:scale-105 ${formData.feedback_timing === 'final'
											? 'border-[#1E90FF] bg-blue-50 shadow-lg'
											: 'border-gray-200 hover:border-blue-300'
											}`}
									>
										<div className="text-4xl mb-3">🎓</div>
										<div className="font-bold text-[#2E2E2E] mb-2">Al finalizar</div>
										<div className="text-sm text-gray-600">Revisa el feedback cuando termines</div>
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Step 3: Experience & Goals */}
					{currentStep === 3 && (
						<div className="flex-1 space-y-6 animate-fade-in overflow-y-auto max-h-[500px] pr-2">
							<div className="text-center mb-6">
								<div className="inline-block p-3 bg-green-100 rounded-full mb-3">
									<Rocket className="w-8 h-8 text-green-600" />
								</div>
								<h2 className="text-2xl font-bold text-[#2E2E2E] font-montserrat">
									Experiencia & Objetivos
								</h2>
								<p className="text-gray-600 mt-2">Cuéntanos sobre tu viaje hasta ahora</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold text-[#2E2E2E] mb-1">
										Experiencia con proyectos *
									</label>
									<p className="text-xs text-gray-500 mb-3">
										Indica el tipo de proyectos en los que has trabajado.
									</p>
									<select
										value={formData.project_experience}
										onChange={(e) => setFormData(prev => ({ ...prev, project_experience: e.target.value as ProjectExperience }))}
										className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
									>
										<option value="">Selecciona...</option>
										<option value="none">Ninguno</option>
										<option value="academic_only">Académicos</option>
										<option value="personal_projects">Personales</option>
										<option value="professional">Profesionales</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-semibold text-[#2E2E2E] mb-1">
										Experiencia con equipos *
									</label>
									<p className="text-xs text-gray-500 mb-3">
										Indica el tipo de equipos con los que has trabajado.
									</p>
									<select
										value={formData.team_experience}
										onChange={(e) => setFormData(prev => ({ ...prev, team_experience: e.target.value as TeamExperience }))}
										className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
									>
										<option value="">Selecciona...</option>
										<option value="solo_only">Solo</option>
										<option value="small_teams">Pequeños equipos (2-5)</option>
										<option value="large_teams">Grandes equipos (6+)</option>
									</select>
								</div>
							</div>

							<div>
								<label className="flex items-center space-x-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-all">
									<input
										type="checkbox"
										checked={formData.has_production_experience}
										onChange={(e) => setFormData(prev => ({ ...prev, has_production_experience: e.target.checked }))}
										className="w-5 h-5 text-[#1E90FF] rounded focus:ring-blue-500"
									/>
									<span className="font-medium text-[#2E2E2E]">
										Tengo experiencia en producción
									</span>
								</label>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
									Tecnologías que quieres dominar
								</label>
								<div className="flex gap-2 mb-2">
									<input
										type="text"
										value={techInput}
										onChange={(e) => setTechInput(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('desired_technologies', techInput, setTechInput))}
										placeholder="Escribe y presiona Enter (e.g., React, Python)"
										className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
									/>
									<button
										type="button"
										onClick={() => addTag('desired_technologies', techInput, setTechInput)}
										className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#1873CC] transition-colors"
									>
										Agregar
									</button>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.desired_technologies.map((tech, idx) => (
										<span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
											{tech}
											<button
												type="button"
												onClick={() => removeTag('desired_technologies', idx)}
												className="hover:text-blue-900"
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
										Áreas de fortaleza
									</label>
									<div className="flex gap-2 mb-2">
										<input
											type="text"
											value={strengthInput}
											onChange={(e) => setStrengthInput(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('strength_areas', strengthInput, setStrengthInput))}
											placeholder="e.g., Algoritmos"
											className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
										/>
										<button
											type="button"
											onClick={() => addTag('strength_areas', strengthInput, setStrengthInput)}
											className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
										>
											+
										</button>
									</div>
									<div className="flex flex-wrap gap-2">
										{formData.strength_areas.map((item, idx) => (
											<span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
												{item}
												<button onClick={() => removeTag('strength_areas', idx)} className="hover:text-green-900">×</button>
											</span>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
										Áreas para mejorar
									</label>
									<div className="flex gap-2 mb-2">
										<input
											type="text"
											value={improvementInput}
											onChange={(e) => setImprovementInput(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('improvement_areas', improvementInput, setImprovementInput))}
											placeholder="e.g., Testing"
											className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
										/>
										<button
											type="button"
											onClick={() => addTag('improvement_areas', improvementInput, setImprovementInput)}
											className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
										>
											+
										</button>
									</div>
									<div className="flex flex-wrap gap-2">
										{formData.improvement_areas.map((item, idx) => (
											<span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
												{item}
												<button onClick={() => removeTag('improvement_areas', idx)} className="hover:text-orange-900">×</button>
											</span>
										))}
									</div>
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
									Áreas de enfoque (Selecciona hasta 5) *
								</label>
								<div className="grid grid-cols-2 gap-2">
									{[
										{ value: 'technical_problem_solving', label: 'Resolución de problemas técnicos' },
										{ value: 'system_design', label: 'Diseño de sistemas' },
										{ value: 'code_quality', label: 'Calidad del código' },
										{ value: 'communication', label: 'Comunicación' },
										{ value: 'debugging', label: 'Depuración' },
										{ value: 'team_collaboration', label: 'Colaboración en equipo' },
										{ value: 'testing', label: 'Testing' },
										{ value: 'performance_optimization', label: 'Optimización de rendimiento' }
									].map(option => (
										<button
											key={option.value}
											type="button"
											onClick={() => toggleFocusArea(option.value as FocusArea)}
											className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${formData.focus_areas.includes(option.value as FocusArea)
												? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]'
												: 'border-gray-200 text-gray-700 hover:border-blue-300'
												}`}
										>
											{option.label}
										</button>
									))}
								</div>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
									Horizonte de aprendizaje *
								</label>
								<select
									value={formData.time_horizon}
									onChange={(e) => setFormData(prev => ({ ...prev, time_horizon: e.target.value as TimeHorizon }))}
									className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
								>
									<option value="">Selecciona...</option>
									<option value="short_term">Corto plazo (3 meses)</option>
									<option value="medium_term">Medio plazo (6 meses)</option>
									<option value="long_term">Largo plazo (1+ año)</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
									Notas adicionales (Opcional)
								</label>
								<textarea
									value={formData.experience_notes}
									onChange={(e) => setFormData(prev => ({ ...prev, experience_notes: e.target.value.slice(0, 500) }))}
									placeholder="Cualquier contexto adicional sobre tu experiencia o metas..."
									rows={3}
									maxLength={500}
									className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF] resize-none"
								/>
								<div className="text-xs text-gray-500 text-right mt-1">
									{formData.experience_notes?.length || 0} / 500
								</div>
							</div>
						</div>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
						<button
							type="button"
							onClick={handleBack}
							disabled={currentStep === 1}
							className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${currentStep === 1
								? 'bg-gray-100 text-gray-400 cursor-not-allowed'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
						>
							<ArrowLeft className="w-5 h-5" />
							Atrás
						</button>

						{currentStep < totalSteps ? (
							<button
								type="button"
								onClick={handleNext}
								disabled={!isStepValid(currentStep)}
								className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${isStepValid(currentStep)
									? 'bg-[#1E90FF] text-white hover:bg-[#1873CC] hover:shadow-lg transform hover:-translate-y-0.5'
									: 'bg-gray-300 text-gray-500 cursor-not-allowed'
									}`}
							>
								Siguiente
								<ArrowRight className="w-5 h-5" />
							</button>
						) : (
							<button
								type="button"
								onClick={handleSubmit}
								disabled={loading}
								className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										Completando...
									</>
								) : (
									<>
										Completar Onboarding
										<Check className="w-5 h-5" />
									</>
								)}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Onboarding;
