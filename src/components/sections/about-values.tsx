import { FaRocket, FaIndustry, FaLightbulb } from "react-icons/fa";


export default function AboutValues() {
  const values = [
    {
      icon: FaRocket,
      title: "Invest to Impact",
      desc: "Every investment in education creates lasting impact. We focus on transforming your educational journey into measurable career outcomes.",
      color: "bg-blue-500",
      delay: "0s"
    },
    {
      icon: FaIndustry,
      title: "Institute to Industry",
      desc: "We bridge the gap between academic institutions and industry expectations, preparing you for real-world success through practical exposure.",
      color: "bg-indigo-500",
      delay: "0.1s"
    },
    {
      icon: FaLightbulb,
      title: "Innovation to Impact",
      desc: "Fostering innovation that creates tangible impact. We nurture creative thinking and practical problem-solving skills for the modern workplace.",
      color: "bg-violet-500",
      delay: "0.2s"
    }
  ];

  return (
    <section className="w-full bg-gray-50 py-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#222222] mb-6">
                What I2I Stands For
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
                Our core philosophy revolves around three pillars that define our approach to education and career transformation.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item, index) => (
                <div 
                    key={index} 
                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                    <div className={`w-16 h-16 ${item.color}/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`text-3xl ${item.color.replace('bg-', 'text-')}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#222222] mb-4 group-hover:text-primary transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        {item.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
