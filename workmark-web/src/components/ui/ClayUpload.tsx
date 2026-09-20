import React, { useRef, useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface ClayUploadProps {
  id?: string;
  type: 'avatar' | 'resume' | 'logo' | 'cover';
  currentUrl?: string | null;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  className?: string;
  error?: string;
}

export const ClayUpload: React.FC<ClayUploadProps> = ({
  id,
  type,
  currentUrl,
  accept,
  maxSizeMB = 5,
  label,
  description,
  isUploading = false,
  onFileSelect,
  onRemove,
  className,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const defaultAccepts = {
    avatar: 'image/png,image/jpeg,image/jpg,image/webp',
    logo: 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml',
    cover: 'image/png,image/jpeg,image/jpg,image/webp',
    resume: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  const activeAccept = accept || defaultAccepts[type];

  const handleFile = (file: File) => {
    setValidationError(null);

    // Size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setValidationError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setSelectedFileName(file.name);
    if (type !== 'resume') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPreview(null);
    setSelectedFileName(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  const displayUrl = localPreview || currentUrl;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs sm:text-sm font-bold text-[#25243A] tracking-tight">
            {label}
          </label>
          {description && <span className="text-xs text-[#6F6D82]">{description}</span>}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={activeAccept}
        onChange={handleChange}
        className="hidden"
      />

      {/* Avatar Type */}
      {type === 'avatar' && (
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F2]">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-2xl overflow-hidden clay-card flex items-center justify-center cursor-pointer group flex-shrink-0"
          >
            {displayUrl ? (
              <img src={displayUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] text-[#6C5CE7] flex items-center justify-center font-bold text-xl">
                <Upload className="h-6 w-6" />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {displayUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
              {displayUrl && onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={isUploading}
                  className="text-[#FF6B81] hover:bg-[#FFEBF0]"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-[#6F6D82]">PNG, JPG, WebP. Max {maxSizeMB}MB.</p>
          </div>
        </div>
      )}

      {/* Logo Type */}
      {type === 'logo' && (
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-[#F8F7FD] border border-[#E8E7F2]">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-2xl overflow-hidden clay-card bg-white p-2 flex items-center justify-center cursor-pointer group flex-shrink-0"
          >
            {displayUrl ? (
              <img src={displayUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] text-[#6C5CE7] flex flex-col items-center justify-center p-2 text-center">
                <Upload className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold">Logo</span>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white rounded-2xl">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {displayUrl ? 'Replace Logo' : 'Upload Logo'}
              </Button>
              {displayUrl && onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={isUploading}
                  className="text-[#FF6B81] hover:bg-[#FFEBF0]"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-[#6F6D82]">Square logo recommended. PNG, JPG, WebP. Max {maxSizeMB}MB.</p>
          </div>
        </div>
      )}

      {/* Cover Banner Type */}
      {type === 'cover' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group',
            dragActive
              ? 'border-[#6C5CE7] bg-[#EDE9FE]/50'
              : displayUrl
              ? 'border-[#E8E7F2] bg-white'
              : 'border-[#D5D2E8] bg-[#F8F7FD] hover:border-[#6C5CE7] hover:bg-[#F5F3FF]'
          )}
        >
          {displayUrl ? (
            <>
              <img src={displayUrl} alt="Cover Banner" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Change Banner
                </Button>
                {onRemove && (
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    className="shadow-lg"
                    onClick={handleClear}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#25243A]">
                  Click or drag banner image here
                </p>
                <p className="text-[11px] text-[#6F6D82] mt-0.5">
                  1200x350px recommended. JPG, PNG, WebP up to {maxSizeMB}MB.
                </p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
              <div className="flex items-center gap-2 bg-white text-[#25243A] px-4 py-2 rounded-xl font-bold shadow-lg">
                <Loader2 className="h-4 w-4 animate-spin text-[#6C5CE7]" />
                <span>Uploading cover image...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resume Document Type */}
      {type === 'resume' && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all',
            dragActive
              ? 'border-[#6C5CE7] bg-[#EDE9FE]/50'
              : displayUrl
              ? 'border-[#A7F3D0] bg-[#F0FDF4]'
              : 'border-[#D5D2E8] bg-[#F8F7FD]'
          )}
        >
          {displayUrl ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#35C98A]/15 text-[#059669] flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[#25243A] truncate">
                    {selectedFileName || 'persisted_resume.pdf'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#059669]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Resume attached</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {currentUrl && (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn clay-btn-secondary text-xs py-1 px-3"
                  >
                    View File
                  </a>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  Replace
                </Button>
                {onRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={isUploading}
                    className="text-[#FF6B81] hover:bg-[#FFEBF0]"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center py-4 cursor-pointer text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6C5CE7] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#25243A]">
                Click or drag to upload Resume / CV
              </p>
              <p className="text-[11px] text-[#6F6D82] mt-0.5">
                PDF, DOC, DOCX up to {maxSizeMB}MB
              </p>
            </div>
          )}

          {isUploading && (
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#6C5CE7]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading resume file...</span>
            </div>
          )}
        </div>
      )}

      {(validationError || error) && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6B81] mt-1">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}
    </div>
  );
};

export default ClayUpload;
