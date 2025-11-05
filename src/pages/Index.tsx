import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface LeakResult {
  type: "safe" | "warning" | "danger";
  count: number;
  breaches: string[];
}

const Index = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<"email" | "phone" | "login">("email");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<LeakResult | null>(null);

  const mockBreaches = [
    { name: "LinkedIn", date: "2021", records: "700M+" },
    { name: "Facebook", date: "2019", records: "533M" },
    { name: "Yahoo", date: "2013", records: "3B" },
    { name: "Adobe", date: "2013", records: "153M" },
    { name: "Dropbox", date: "2012", records: "68M" },
  ];

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error("Введите данные для проверки");
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.7) {
        setResult({
          type: "danger",
          count: Math.floor(Math.random() * 5) + 3,
          breaches: ["LinkedIn 2021", "Facebook 2019", "Adobe 2013"],
        });
      } else if (random > 0.4) {
        setResult({
          type: "warning",
          count: Math.floor(Math.random() * 2) + 1,
          breaches: ["Dropbox 2012"],
        });
      } else {
        setResult({
          type: "safe",
          count: 0,
          breaches: [],
        });
      }
      setIsSearching(false);
    }, 1500);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Shield" className="h-6 w-6" />
              <span className="text-xl font-semibold">LeakCheck</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("check")} className="text-sm font-medium hover:text-gray-600 transition-colors">
                Проверка
              </button>
              <button onClick={() => scrollToSection("database")} className="text-sm font-medium hover:text-gray-600 transition-colors">
                База
              </button>
              <button onClick={() => scrollToSection("faq")} className="text-sm font-medium hover:text-gray-600 transition-colors">
                FAQ
              </button>
              <button onClick={() => scrollToSection("api")} className="text-sm font-medium hover:text-gray-600 transition-colors">
                API
              </button>
              <button onClick={() => scrollToSection("contacts")} className="text-sm font-medium hover:text-gray-600 transition-colors">
                Контакты
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Проверьте свои данные на утечки
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Узнайте, были ли ваши личные данные скомпрометированы в известных утечках данных
          </p>
        </div>
      </section>

      <section id="check" className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Проверка данных</CardTitle>
              <CardDescription>Выберите тип данных и введите значение для проверки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email">
                    <Icon name="Mail" className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone">
                    <Icon name="Phone" className="h-4 w-4 mr-2" />
                    Телефон
                  </TabsTrigger>
                  <TabsTrigger value="login">
                    <Icon name="User" className="h-4 w-4 mr-2" />
                    Логин
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-3">
                <Input
                  placeholder={
                    searchType === "email"
                      ? "example@mail.com"
                      : searchType === "phone"
                      ? "+7 (900) 123-45-67"
                      : "username"
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="text-lg py-6"
                />
                <Button onClick={handleSearch} disabled={isSearching} className="px-8 py-6 text-lg">
                  {isSearching ? (
                    <Icon name="Loader2" className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon name="Search" className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {result && (
                <div className="mt-8 p-6 rounded-lg border-2 animate-fade-in" 
                  style={{
                    borderColor: result.type === "danger" ? "#EF4444" : result.type === "warning" ? "#F59E0B" : "#10B981",
                    backgroundColor: result.type === "danger" ? "#FEF2F2" : result.type === "warning" ? "#FFFBEB" : "#F0FDF4"
                  }}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      result.type === "danger" ? "bg-red-500" : result.type === "warning" ? "bg-amber-500" : "bg-green-500"
                    }`}>
                      <Icon 
                        name={result.type === "safe" ? "ShieldCheck" : "ShieldAlert"} 
                        className="h-6 w-6 text-white" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {result.type === "danger" && "Обнаружены утечки!"}
                        {result.type === "warning" && "Найдена утечка"}
                        {result.type === "safe" && "Данные безопасны"}
                      </h3>
                      <p className="text-gray-700 mb-4">
                        {result.type === "safe"
                          ? "Ваши данные не найдены в известных базах утечек"
                          : `Найдено совпадений: ${result.count}`}
                      </p>
                      {result.breaches.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-medium text-sm">Утечки:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.breaches.map((breach, i) => (
                              <Badge key={i} variant="outline" className="font-normal">
                                {breach}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="database" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">База известных утечек</h2>
            <p className="text-gray-600">Крупнейшие утечки данных за последние годы</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBreaches.map((breach, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {breach.name}
                    <Icon name="Database" className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                  <CardDescription>{breach.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Icon name="Users" className="h-4 w-4 text-gray-500" />
                    <span className="text-2xl font-semibold">{breach.records}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">записей скомпрометировано</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Частые вопросы</h2>
            <p className="text-gray-600">Ответы на популярные вопросы о безопасности данных</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white px-6 rounded-lg border">
              <AccordionTrigger className="text-left hover:no-underline">
                Что такое утечка данных?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Утечка данных — это несанкционированное раскрытие конфиденциальной информации. Это может произойти
                из-за взлома, ошибок в безопасности или действий инсайдеров.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-white px-6 rounded-lg border">
              <AccordionTrigger className="text-left hover:no-underline">
                Как защитить свои данные?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Используйте уникальные сложные пароли для каждого сервиса, включите двухфакторную аутентификацию,
                регулярно обновляйте пароли и следите за подозрительной активностью в аккаунтах.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-white px-6 rounded-lg border">
              <AccordionTrigger className="text-left hover:no-underline">
                Что делать, если нашли мои данные?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Немедленно смените пароли на всех затронутых сервисах, включите дополнительные меры безопасности,
                проверьте активность в аккаунтах и рассмотрите использование менеджера паролей.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-white px-6 rounded-lg border">
              <AccordionTrigger className="text-left hover:no-underline">
                Откуда данные об утечках?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Мы собираем информацию из публичных источников, баз данных утечек, отчетов компаний о
                инцидентах безопасности и исследований специалистов по кибербезопасности.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section id="api" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">API для разработчиков</h2>
            <p className="text-gray-600">Интегрируйте проверку утечек в свои приложения</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>REST API</CardTitle>
              <CardDescription>Простой и быстрый доступ к базе данных утечек</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="mb-4">
                  <span className="text-gray-500"># Проверка email</span>
                </div>
                <div>
                  curl -X GET "https://api.leakcheck.io/v1/check" \<br />
                  &nbsp;&nbsp;-H "X-API-Key: your_api_key" \<br />
                  &nbsp;&nbsp;-d "email=example@mail.com"
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="CheckCircle2" className="h-5 w-5 text-green-600" />
                  <span>Лимит: 1000 запросов/день</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="CheckCircle2" className="h-5 w-5 text-green-600" />
                  <span>Формат ответа: JSON</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Icon name="CheckCircle2" className="h-5 w-5 text-green-600" />
                  <span>Поддержка: email, phone, username</span>
                </div>
              </div>
              <Button className="w-full">
                Получить API ключ
                <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="contacts" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">Свяжитесь с нами</h2>
          <p className="text-gray-600 mb-8">
            Есть вопросы или предложения? Мы всегда рады помочь
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="gap-2">
              <Icon name="Mail" className="h-5 w-5" />
              support@leakcheck.io
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Icon name="MessageCircle" className="h-5 w-5" />
              Telegram
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Icon name="Shield" className="h-5 w-5" />
              <span className="font-semibold">LeakCheck</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 LeakCheck. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
