"use client";

import { useEffect, useState, useRef } from "react";
import { Film, Plus, Edit, Trash2, X, Upload } from "lucide-react";
import { adminApi } from "@/lib/api-admin";

interface AdminMovie {
  id: string;
  title: string;
  description: string;
  director: string;
  cast: string[];
  durationSecs: number;
  releaseDate: string;
  ageRating: string;
  posterUrl: string;
  bannerUrl: string;
  published: boolean;
  rentalPrice?: number;
  purchasePrice?: number;
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<AdminMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMovie, setEditingMovie] = useState<Partial<AdminMovie> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const fetchMovies = async () => {
    try {
      const { api } = await import("@/lib/api");
      const data = await api.getAllMovies();
      setMovies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      await adminApi.deleteMovie(id);
      fetchMovies();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    
    // Convert cast to array
    const castRaw = formData.get("cast") as string;
    if (castRaw) {
      formData.set("cast", JSON.stringify(castRaw.split(",").map(s => s.trim())));
    } else {
      formData.set("cast", JSON.stringify([]));
    }
    
    // Format prices correctly (handle empty)
    if (!formData.get("rentalPrice")) formData.delete("rentalPrice");
    if (!formData.get("purchasePrice")) formData.delete("purchasePrice");

    try {
      if (isCreating) {
        await adminApi.createMovie(formData);
      } else if (editingMovie?.id) {
        await adminApi.updateMovie(editingMovie.id, formData);
      }
      setIsCreating(false);
      setEditingMovie(null);
      fetchMovies();
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="space-y-4">
        <div className="h-10 w-40 rounded-xl bg-white/5 animate-pulse" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );

  if (isCreating || editingMovie) {
    const m = isCreating ? {} as Partial<AdminMovie> : editingMovie!;
    return (
      <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 relative">
        <button 
          onClick={() => { setIsCreating(false); setEditingMovie(null); }}
          className="absolute top-6 right-6 text-white/50 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">
          {isCreating ? "Create Movie" : "Edit Movie"}
        </h2>

        <form ref={formRef} onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
              <input name="title" defaultValue={m.title} required className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Director</label>
              <input name="director" defaultValue={m.director} required className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
              <textarea name="description" defaultValue={m.description} required rows={3} className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Age Rating</label>
              <select name="ageRating" defaultValue={m.ageRating || "PG"} className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white">
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NR">NR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Release Date</label>
              <input name="releaseDate" type="date" defaultValue={m.releaseDate ? new Date(m.releaseDate).toISOString().split('T')[0] : ''} className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Duration (seconds)</label>
              <input name="durationSecs" type="number" defaultValue={m.durationSecs} required className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Cast (comma separated)</label>
              <input name="cast" defaultValue={m.cast?.join(", ")} className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Rental Price ($)</label>
                <input name="rentalPrice" type="number" step="0.01" defaultValue={m.rentalPrice} className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Purchase Price ($)</label>
                <input name="purchasePrice" type="number" step="0.01" defaultValue={m.purchasePrice} className="w-full bg-zinc-950 border border-white/10 rounded-md p-2 text-white" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-white">
                  <input name="published" type="checkbox" value="true" defaultChecked={m.published} className="w-5 h-5 bg-zinc-950 border border-white/10 rounded" />
                  Published
                </label>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Poster Image</label>
                <input name="posterFile" type="file" accept="image/*" className="w-full text-white/70 text-sm" />
                {m.posterUrl && <img src={m.posterUrl} alt="Poster" className="mt-2 h-24 object-cover rounded" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Banner Image</label>
                <input name="bannerFile" type="file" accept="image/*" className="w-full text-white/70 text-sm" />
                {m.bannerUrl && <img src={m.bannerUrl} alt="Banner" className="mt-2 h-24 object-cover rounded" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Video File</label>
                <input name="videoFile" type="file" accept="video/*" className="w-full text-white/70 text-sm" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={() => { setIsCreating(false); setEditingMovie(null); }} className="px-4 py-2 rounded-md bg-zinc-800 text-white hover:bg-zinc-700">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white font-medium hover:bg-primary/90">Save Movie</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Movies Management</h2>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/20 text-red-500 rounded-md border border-red-500/20">{error}</div>}

      <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-white/5 text-white/90">
              <tr>
                <th className="px-6 py-4 font-medium">Movie</th>
                <th className="px-6 py-4 font-medium">Director</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={movie.posterUrl || (movie as any).assets?.find((a: any)=>a.type==="POSTER")?.url} alt={movie.title} className="w-10 h-14 object-cover rounded shadow bg-zinc-800" />
                    <div>
                      <div className="font-medium text-white">{movie.title}</div>
                      <div className="text-xs text-white/50">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{movie.director}</td>
                  <td className="px-6 py-4">{movie.ageRating}</td>
                  <td className="px-6 py-4">
                    {movie.published ? (
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">Published</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20">Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setEditingMovie(movie)} className="text-blue-400 hover:text-blue-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(movie.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {movies.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-white/50">No movies found. Create one above!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
