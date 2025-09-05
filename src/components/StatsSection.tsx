import { Building, Users, Award, TrendingUp } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Building,
      value: "15,000+",
      label: "Properties Listed",
      description: "Active listings across Vietnam"
    },
    {
      icon: Users,
      value: "50,000+",
      label: "Happy Customers",
      description: "Satisfied clients nationwide"
    },
    {
      icon: Award,
      value: "25+",
      label: "Awards Won",
      description: "Recognition for excellence"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Success Rate",
      description: "Properties sold successfully"
    }
  ];

  return (
    <section className="py-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join the growing community of property owners and buyers who trust EstateHub for their real estate needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
                <stat.icon className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
              <div className="text-white/80">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;