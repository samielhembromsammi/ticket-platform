"use client";
import { useEffect, useState, Suspense } from "react";
import api from "@/src/services/api";
import { Select, Input, Slider, Checkbox } from "antd";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import EventCard from "@/src/components/reuseable/event-card";

function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCategoryParam = searchParams.get("category") || undefined;

  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    api.get("/categories").then(res => {
      const fetchedCategories = res.data.data;
      setCategories(fetchedCategories);
      if (initialCategoryParam) {
        const names = initialCategoryParam.split(",");
        const matchedIds = fetchedCategories
          .filter((c: any) => names.some(n => n.toLowerCase() === c.name.toLowerCase() || n === c._id))
          .map((c: any) => c._id);
        if (matchedIds.length > 0) {
          setCategoryFilters(matchedIds);
        }
      }
      setCategoriesLoaded(true);
    }).catch(console.error);
  }, [initialCategoryParam]);

  useEffect(() => {
    if (!categoriesLoaded) return;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        let url = `/events?limit=50`;
        if (categoryFilters.length > 0) url += `&categoryId=${categoryFilters.join(",")}`;

        const isPremiumFlags: string[] = [];
        if (typeFilters.includes("premium")) isPremiumFlags.push("true");
        if (typeFilters.includes("free")) isPremiumFlags.push("false");

        if (isPremiumFlags.length > 0) {
          url += `&isPremium=${isPremiumFlags.join(",")}`;
        }

        if (search) url += `&search=${search}`;

        const res = await api.get(url);
        setEvents(res.data.data.results || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    // debounce search
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [categoryFilters, typeFilters, search, categoriesLoaded]);

  const handleCategoryChange = (id: string, checked: boolean) => {
    let newFilters = [...categoryFilters];
    if (checked) {
      newFilters.push(id);
    } else {
      newFilters = newFilters.filter(f => f !== id);
    }
    setCategoryFilters(newFilters);

    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.length > 0) {
      const names = newFilters.map(f => categories.find(c => c._id === f)?.name).filter(Boolean);
      params.set("category", names.join(","));
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    let newFilters = [...typeFilters];
    if (checked) {
      newFilters.push(type);
    } else {
      newFilters = newFilters.filter(f => f !== type);
    }
    setTypeFilters(newFilters);
  };

  const clearFilters = () => {
    setCategoryFilters([]);
    setTypeFilters([]);
    setSearch("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Discover Events</h1>
        <p className="text-gray-500 text-lg">Find the perfect event matching your interests.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-1/4 flex flex-col gap-6 sticky top-24">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Search</h3>
              <Input
                size="large"
                placeholder="Search events by title..."
                prefix={<Search className="text-gray-400 w-5 h-5 mr-2" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl h-12"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Category</h3>
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((c) => (
                  <Checkbox
                    key={c._id}
                    checked={categoryFilters.includes(c._id)}
                    onChange={(e) => handleCategoryChange(c._id, e.target.checked)}
                    className="ml-0 text-gray-700"
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Event Type</h3>
              <div className="flex flex-col gap-3">
                <Checkbox
                  checked={typeFilters.includes("premium")}
                  onChange={(e) => handleTypeChange("premium", e.target.checked)}
                  className="ml-0 text-gray-700"
                >
                  Premium
                </Checkbox>
                <Checkbox
                  checked={typeFilters.includes("free")}
                  onChange={(e) => handleTypeChange("free", e.target.checked)}
                  className="ml-0 text-gray-700"
                >
                  Free
                </Checkbox>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Price Range</h3>
              <Slider range defaultValue={[0, 100]} max={500} tooltip={{ formatter: (val) => `$${val}` }} />
            </div>

            <div className="pt-4 border-t border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Top Rated</h3>
              <div className="flex flex-col gap-3">
                <Checkbox>4 Stars & Up</Checkbox>
                <Checkbox className="ml-0">Top Rated Events Only</Checkbox>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Professional</h3>
              <div className="flex flex-col gap-3">
                <Checkbox>Tech & IT</Checkbox>
                <Checkbox className="ml-0">Business & Finance</Checkbox>
                <Checkbox className="ml-0">Networking</Checkbox>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-5 rounded-2xl border border-gray-100 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-gray-600 font-medium">
                Showing <span className="text-gray-900 font-bold">{events.length}</span> events
              </span>

              {/* Active Filters Message */}
              {(categoryFilters.length > 0 || search || typeFilters.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 mr-1 uppercase tracking-wider font-semibold">Active Filters:</span>
                  {search && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md border border-blue-200">
                      Search: "{search}"
                    </span>
                  )}
                  {categoryFilters.map(id => {
                    const catName = categories.find(c => c._id === id)?.name;
                    return catName ? (
                      <span key={id} className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-md border border-purple-200">
                        Category: {catName}
                      </span>
                    ) : null;
                  })}
                  {typeFilters.map(type => (
                    <span key={type} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-200">
                      Type: {type === "premium" ? "Premium" : "Free"}
                    </span>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-red-600 underline ml-2 transition-colors font-medium cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
              <Select
                size="middle"
                className="w-40"
                defaultValue="new"
                options={[
                  { label: "Newest", value: "new" },
                  { label: "Oldest", value: "old" },
                  { label: "Name (A-Z)", value: "asc" },
                  { label: "Name (Z-A)", value: "desc" },
                ]}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600">
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
